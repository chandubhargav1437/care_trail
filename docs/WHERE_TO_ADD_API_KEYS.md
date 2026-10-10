# 🔑 Where to Add Your API Keys - Quick Reference

## File Location
**Edit this file:** `caretrail/.env.local`

## Required Values

### 1️⃣ Supabase (Get from: https://supabase.com/dashboard)

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-long-key-here
```

**How to get:**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy "Project URL" → paste into `SUPABASE_URL`
4. Copy "service_role secret" → paste into `SUPABASE_SERVICE_ROLE_KEY`

---

### 2️⃣ OpenAI (Get from: https://platform.openai.com/api-keys)

```env
OPENAI_API_KEY=sk-proj-...your-key-here
OPENAI_MODEL=gpt-4o
```

**How to get:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (you only see it once!)
4. Paste into `OPENAI_API_KEY`

**Important:** 
- You need at least $5 credit in your OpenAI account
- Model must be `gpt-4o` (vision-capable)

---

### 3️⃣ Security Secrets (Generate Random)

```env
AADHAAR_PEPPER=your_random_32_char_string
SESSION_SECRET=your_random_32_char_string
```

**How to generate:**

Run these commands in your terminal:

```bash
# Generate AADHAAR_PEPPER
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy each output and paste into `.env.local`

---

## Complete Example

Your `.env.local` should look like this:

```env
# Supabase
SUPABASE_URL=https://abcdefghijklmno.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2ODk4NTE2NzUsImV4cCI6MjAwNTQyNzY3NX0.abcdefghijklmnopqrstuvwxyz1234567890

# OpenAI
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
OPENAI_MODEL=gpt-4o

# Security (generated with node command above)
AADHAAR_PEPPER=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
SESSION_SECRET=f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Checklist

- [ ] Supabase URL added
- [ ] Supabase service role key added
- [ ] OpenAI API key added
- [ ] AADHAAR_PEPPER generated and added
- [ ] SESSION_SECRET generated and added
- [ ] Saved `.env.local` file
- [ ] Run `npm run dev` to test

---

## Verify Setup

After adding all keys, run:

```bash
npm run dev
```

Look for this in the console:
```
✅ Environment variables validated successfully
```

If you see errors, check that:
1. All values are filled in
2. No extra spaces or quotes
3. Secrets are at least 32 characters
4. Supabase URL starts with `https://`
5. OpenAI key starts with `sk-`

---

## What Each Key Does

| Key | Purpose | Where It's Used |
|-----|---------|----------------|
| `SUPABASE_URL` | Database connection | All database operations |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access | Bypasses RLS for secure operations |
| `OPENAI_API_KEY` | AI extraction | Reading PDFs/images to extract medical data |
| `AADHAAR_PEPPER` | ID security | Hashing Aadhaar numbers (never stores full ID) |
| `SESSION_SECRET` | Auth security | Signing JWT session tokens |

---

## Security Notes

🔒 **NEVER commit `.env.local` to git**
- It's already in `.gitignore`
- These are SECRET keys
- Anyone with these keys can access your database

✅ **DO commit `.env.example`**
- It shows what variables are needed
- Values are empty placeholders
- Safe to share publicly

---

## Next Steps

After adding your API keys:

1. **Run the database schema:**
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Copy content from `supabase/schema.sql`
   - Paste and run

2. **Create storage bucket:**
   - Go to Storage in Supabase
   - Click "New Bucket"
   - Name: `documents`
   - Set to **Private**

3. **Start the app:**
   ```bash
   npm run dev
   ```

4. **Test OpenAI:**
   - Upload a medical document
   - Check if extraction works
   - If it fails, it will fall back to simulated data

---

## Troubleshooting

### "Missing required environment variable"
→ Check spelling and make sure no value is empty

### "AADHAAR_PEPPER must be at least 32 characters"
→ Regenerate with the `node -e` command above

### Supabase connection fails
→ Verify URL format: `https://xxx.supabase.co`
→ Check service role key is the long one (not anon key)

### OpenAI fails but app still works
→ Normal! App falls back to simulated extraction
→ Check API key and credits to enable real extraction

---

## 🎉 That's It!

Once all keys are added, you're ready to use:
- ✅ Real cloud database (Supabase)
- ✅ Aadhaar-based authentication
- ✅ Real AI extraction (OpenAI)
- ✅ Secure sessions
- ✅ Doctor access
- ✅ Production-ready security
