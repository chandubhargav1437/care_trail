import { NextRequest, NextResponse } from 'next/server';
import { requirePatient } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { uploadToStorage, validateFile, fileToBase64 } from '@/lib/upload';
import { extractionSchema } from '@/lib/validation';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
    try {
        // Only patients can upload documents
        const session = await requirePatient();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Upload to Supabase Storage
        const storagePath = await uploadToStorage(file, session.patientId);

        // Convert file to base64 for OpenAI
        const base64 = await fileToBase64(file);
        const mimeType = file.type;

        // Check if we have an OpenAI API key
        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'demo_key') {
            // Fallback to simulated extraction
            const { getSimulatedExtraction } = await import('@/lib/demo-data');
            const extraction = getSimulatedExtraction(file.name);

            // Save document metadata to database (pending review)
            const { data: document, error: docError } = await supabaseAdmin
                .from('documents')
                .insert({
                    patient_id: session.patientId,
                    storage_path: storagePath,
                    document_type: extraction?.document_type || 'other',
                    provider_name: extraction?.provider_name || 'Unknown',
                    document_date: extraction?.document_date || new Date().toISOString().split('T')[0],
                    extraction_json: extraction || {},
                    confirmed_at: null, // Not confirmed yet
                })
                .select()
                .single();

            if (docError) {
                console.error('Document save error:', docError);
                return NextResponse.json(
                    { error: 'Failed to save document metadata' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                document_id: document.id,
                extraction,
                source: 'simulated',
                storage_path: storagePath,
            });
        }

        // Real AI extraction using OpenAI Vision API
        // Step 1: First extract doctor name and hospital separately
        const doctorExtractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: env.OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert at reading medical documents. Your ONLY job is to find the doctor name and hospital name.

CRITICAL INSTRUCTIONS:
1. Find the TREATING DOCTOR or CONSULTANT name (NOT hospital name)
2. Look in these locations IN ORDER:
   - "Consultant:" or "Treating Doctor:" field (usually near top)
   - Signature at bottom with "Dr." prefix
   - "Prescribed by" or "Attending Physician" field
   - Any text with "Dr." followed by a person's name
3. Extract COMPLETE name with title and qualifications
4. Find the HOSPITAL or CLINIC name (usually in header/letterhead)

Return ONLY this JSON (no other text):
{
  "doctor_name": "Dr. Full Name, Qualifications (e.g., Dr. Rajesh Kumar, MD)",
  "hospital_name": "Hospital/Clinic Name"
}

If doctor name not found, use: "Not mentioned"
If hospital not found, use: "Unknown"`,
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Extract the doctor name and hospital name from this medical document.',
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${base64}`,
                                    detail: 'high',
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 500,
                temperature: 0.1,
            }),
        });

        let doctorName = 'Not mentioned';
        let hospitalName = 'Unknown';

        if (doctorExtractionResponse.ok) {
            try {
                const doctorData = await doctorExtractionResponse.json();
                const doctorContent = doctorData.choices[0]?.message?.content;
                if (doctorContent) {
                    const jsonMatch =
                        doctorContent.match(/```json\n([\s\S]*?)\n```/) ||
                        doctorContent.match(/```\n([\s\S]*?)\n```/);
                    const jsonStr = jsonMatch ? jsonMatch[1] : doctorContent;
                    const doctorInfo = JSON.parse(jsonStr);
                    doctorName = doctorInfo.doctor_name || 'Not mentioned';
                    hospitalName = doctorInfo.hospital_name || 'Unknown';
                    console.log('Extracted doctor:', doctorName, 'Hospital:', hospitalName);
                }
            } catch (err) {
                console.error('Failed to parse doctor extraction:', err);
            }
        }

        // Step 2: Now extract full medical data with the doctor name pre-identified
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: env.OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical document extraction assistant. Extract ALL medical information with MAXIMUM accuracy.

IMPORTANT CONTEXT:
- The treating doctor/consultant is: ${doctorName}
- The hospital/clinic is: ${hospitalName}
- Use these EXACT names in your extraction (prescriber field for medications)

CRITICAL RULES:
- Extract EVERY medication, condition, lab result visible
- For ALL medications, set "prescriber" to: ${doctorName}
- Set "provider_name" to: ${hospitalName}
- Extract exact doses with units (mg, ml, g)
- Extract exact frequencies (BD=twice daily, TDS=thrice daily, OD=once daily, QID=4 times daily)
- Extract ALL diagnoses from diagnosis section
- Extract ALL lab results from investigations table
- Use exact spelling and values from document

Return a JSON object with this EXACT structure:
{
  "document_type": "prescription" | "lab_report" | "discharge_summary" | "consultation" | "other",
  "provider_name": "${hospitalName}",
  "document_date": "YYYY-MM-DD",
  "conditions": [
    {
      "name": "EXACT diagnosis name",
      "recorded_date": "YYYY-MM-DD",
      "status": "active",
      "source_text": "exact text from document"
    }
  ],
  "medications": [
    {
      "name": "EXACT medicine name",
      "generic_name": "generic name if different",
      "dose": "EXACT dose with unit (e.g., 500 mg)",
      "frequency": "EXACT frequency (e.g., Twice daily, BD, OD)",
      "start_date": "YYYY-MM-DD",
      "prescriber": "${doctorName}",
      "source_text": "exact text from medicine table"
    }
  ],
  "allergies": [
    {
      "substance": "allergen name",
      "reaction": "reaction",
      "severity": "mild|moderate|severe",
      "source_text": "exact text"
    }
  ],
  "lab_results": [
    {
      "test_name": "EXACT test name",
      "value": "EXACT value",
      "unit": "EXACT unit",
      "reference_range": "reference range",
      "recorded_date": "YYYY-MM-DD",
      "lab_name": "lab name if mentioned",
      "source_text": "exact text"
    }
  ]
}

EXTRACTION PRIORITY:
1. Find ALL medications in medicine table/prescription list
2. Extract COMPLETE details: name, dose (with mg/ml/g), frequency (BD/TDS/OD)
3. For ALL medications, use prescriber: "${doctorName}"
4. Find ALL diagnoses in diagnosis section
5. Find ALL lab results in investigations table
6. Extract exact values and units

IMPORTANT:
- Every medication MUST have prescriber set to: "${doctorName}"
- Provider name MUST be: "${hospitalName}"
- Extract ALL rows from medication tables
- Extract ALL diagnoses listed
- Use exact spellings and values from document`,
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Extract medical information from this document.',
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${base64}`,
                                    detail: 'high',
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 4000,
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI API error:', error);

            // Fallback to simulated extraction on API error
            const { getSimulatedExtraction } = await import('@/lib/demo-data');
            const extraction = getSimulatedExtraction(file.name);

            // Save document metadata
            const { data: document, error: docError } = await supabaseAdmin
                .from('documents')
                .insert({
                    patient_id: session.patientId,
                    storage_path: storagePath,
                    document_type: extraction?.document_type || 'other',
                    provider_name: extraction?.provider_name || 'Unknown',
                    document_date: extraction?.document_date || new Date().toISOString().split('T')[0],
                    extraction_json: extraction || {},
                    confirmed_at: null,
                })
                .select()
                .single();

            if (docError) {
                console.error('Document save error:', docError);
                return NextResponse.json(
                    { error: 'Failed to save document metadata' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                document_id: document.id,
                extraction,
                source: 'simulated',
                note: 'API error, using simulated data',
                storage_path: storagePath,
            });
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content in API response');
        }

        // Parse JSON from response
        let extraction;
        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch =
                content.match(/```json\n([\s\S]*?)\n```/) ||
                content.match(/```\n([\s\S]*?)\n```/);
            const jsonStr = jsonMatch ? jsonMatch[1] : content;
            extraction = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('Failed to parse AI response:', content);
            // Fallback to simulated extraction
            const { getSimulatedExtraction } = await import('@/lib/demo-data');
            extraction = getSimulatedExtraction(file.name);

            // Save document metadata
            const { data: document, error: docError } = await supabaseAdmin
                .from('documents')
                .insert({
                    patient_id: session.patientId,
                    storage_path: storagePath,
                    document_type: extraction?.document_type || 'other',
                    provider_name: extraction?.provider_name || 'Unknown',
                    document_date: extraction?.document_date || new Date().toISOString().split('T')[0],
                    extraction_json: extraction || {},
                    confirmed_at: null,
                })
                .select()
                .single();

            if (docError) {
                console.error('Document save error:', docError);
                return NextResponse.json(
                    { error: 'Failed to save document metadata' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                document_id: document.id,
                extraction,
                source: 'simulated',
                note: 'Parse error, using simulated data',
                storage_path: storagePath,
            });
        }

        // Validate the extraction
        const validatedExtraction = extractionSchema.parse(extraction);

        // Save document metadata to database (pending review)
        const { data: document, error: docError } = await supabaseAdmin
            .from('documents')
            .insert({
                patient_id: session.patientId,
                storage_path: storagePath,
                document_type: validatedExtraction.document_type || 'other',
                provider_name: validatedExtraction.provider_name,
                document_date: validatedExtraction.document_date,
                extraction_json: validatedExtraction,
                confirmed_at: null, // Not confirmed yet
            })
            .select()
            .single();

        if (docError) {
            console.error('Document save error:', docError);
            return NextResponse.json(
                { error: 'Failed to save document metadata' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            document_id: document.id,
            extraction: validatedExtraction,
            source: 'openai',
            model: env.OPENAI_MODEL,
            storage_path: storagePath,
        });
    } catch (error: any) {
        console.error('Extraction error:', error);

        if (
            error.message?.includes('Forbidden') ||
            error.message?.includes('Unauthorized')
        ) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        // Final fallback to simulated extraction
        try {
            const { getSimulatedExtraction } = await import('@/lib/demo-data');
            const extraction = getSimulatedExtraction('fallback.pdf');

            // Still try to save to database even in fallback
            const session = await requirePatient();
            const { data: document } = await supabaseAdmin
                .from('documents')
                .insert({
                    patient_id: session.patientId,
                    storage_path: 'fallback/error.pdf',
                    document_type: extraction?.document_type || 'other',
                    provider_name: extraction?.provider_name || 'Unknown',
                    document_date: extraction?.document_date || new Date().toISOString().split('T')[0],
                    extraction_json: extraction || {},
                    confirmed_at: null,
                })
                .select()
                .single();

            if (document) {
                return NextResponse.json({
                    success: true,
                    document_id: document.id,
                    extraction,
                    source: 'simulated',
                    note: 'Error occurred, using simulated data',
                });
            }

            return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
        } catch {
            return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
        }
    }
}
