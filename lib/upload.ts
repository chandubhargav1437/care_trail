import { supabaseAdmin } from './supabase-admin';

/**
 * Upload file to Supabase Storage
 * Returns the storage path
 */
export async function uploadToStorage(
    file: File,
    patientId: string
): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
        .from('documents')
        .upload(fileName, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Failed to upload file to storage');
    }

    return data.path;
}

/**
 * Get public URL for a storage file
 */
export function getStorageUrl(path: string): string {
    const { data } = supabaseAdmin.storage
        .from('documents')
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Get signed URL for private storage file (expires in 1 hour)
 */
export async function getSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from('documents')
        .createSignedUrl(path, 3600); // 1 hour

    if (error) {
        console.error('Signed URL error:', error);
        throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFromStorage(path: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
        .from('documents')
        .remove([path]);

    if (error) {
        console.error('Storage delete error:', error);
        throw new Error('Failed to delete file from storage');
    }
}

/**
 * Convert file to base64 for OpenAI Vision API
 * Server-side version using Buffer
 */
export async function fileToBase64(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload PDF, JPEG, PNG, or WebP files.',
        };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size too large. Maximum size is 10MB.',
        };
    }

    return { valid: true };
}
