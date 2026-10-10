// Environment variable validation
// This runs on server startup and throws if any required variable is missing

function getEnvVar(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

// Validate and export environment variables
export const env = {
    SUPABASE_URL: getEnvVar('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
    AADHAAR_PEPPER: getEnvVar('AADHAAR_PEPPER'),
    SESSION_SECRET: getEnvVar('SESSION_SECRET'),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

// Validate that secrets are strong enough
if (env.AADHAAR_PEPPER.length < 32) {
    throw new Error('AADHAAR_PEPPER must be at least 32 characters long')
}

if (env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long')
}

console.log('✅ Environment variables validated successfully')
