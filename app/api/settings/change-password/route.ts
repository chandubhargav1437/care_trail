import { NextRequest, NextResponse } from 'next/server';
import { requirePatient } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        // Only patients can change their own password
        const session = await requirePatient();

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Get patient
        const { data: patient, error: patientError } = await supabaseAdmin
            .from('patients')
            .select('password_hash')
            .eq('id', session.patientId)
            .single();

        if (patientError || !patient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
            currentPassword,
            patient.password_hash
        );

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        const { error: updateError } = await supabaseAdmin
            .from('patients')
            .update({
                password_hash: newPasswordHash,
                password_changed_at: new Date().toISOString(),
            })
            .eq('id', session.patientId);

        if (updateError) {
            console.error('Password update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'Password changed successfully' });
    } catch (error: any) {
        console.error('Change password error:', error);

        if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
