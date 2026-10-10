import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireSession();
        const { id: documentId } = await params;

        // Get document
        const { data: document, error } = await supabaseAdmin
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('patient_id', session.patientId)
            .single();

        if (error || !document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ document });
    } catch (error: any) {
        console.error('Document fetch error:', error);

        if (
            error.message?.includes('Forbidden') ||
            error.message?.includes('Unauthorized')
        ) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to load document' },
            { status: 500 }
        );
    }
}
