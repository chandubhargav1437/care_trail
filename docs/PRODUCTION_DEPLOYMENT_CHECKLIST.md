# CareTrail Production Deployment Checklist ✅

## Pre-Deployment Checklist

### ✅ 1. Code Quality
- [x] All features implemented
- [x] Duplicate handling for medications/conditions/allergies
- [x] Two-step doctor name extraction
- [x] Timeline loads from database
- [x] Summary loads from database
- [x] Authentication working
- [x] Session management working
- [x] File upload working

### ✅ 2. Environment Variables Ready
Create `.env.production` file with:
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# OpenAI (REQUIRED for AI extraction)
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o

# Security (GENERATE NEW SECRETS FOR PRODUCTION!)
AADHAAR_PEPPER=<generate-random-64-char-hex>
SESSION_SECRET=<generate-random-64-char-hex>

# App URL (will be your Vercel URL)
NEXT_PUBLIC_APP_URL=https://caretrail.vercel.app

# Optional: SSL bypass (remove for production)
# NODE_TLS_REJECT_UNAUTHORIZED=0  # DO NOT USE IN PRODUCTION
```

### ✅ 3. Database Schema Deployed
- [x] Run `supabase/schema.sql` in Supabase SQL Editor
- [x] All tables created (patients, documents, conditions, medications, allergies, lab_results, access_log)
- [x] Indexes created for performance
- [x] Row Level Security enabled

### ✅ 4. Supabase Storage Setup
- [x] Create bucket named "documents" (private)
- [x] Configure storage policies (via service role)

### ✅ 5. Security Review
- [x] No secrets in code
- [x] Environment variables used correctly
- [x] Session management secure
- [x] HMAC hashing for Aadhaar
- [x] No raw passwords stored
- [x] TLS certificate verification enabled

### ✅ 6. Git Repository Ready
- [x] All code committed
- [x] .gitignore includes .env files
- [x] README updated
- [x] Documentation complete

## Deployment Steps

### Option 1: Vercel (Recommended - Fastest)

#### Step 1: Prepare Repository
```bash
# Make sure you're in the caretrail directory
cd c:\D\companies\bit_byte_hackathon\caretrail

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Production ready: CareTrail with AI extraction and duplicate handling"
```

#### Step 2: Push to GitHub
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/caretrail.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy on Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your "caretrail" repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

#### Step 4: Add Environment Variables in Vercel
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL = <your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-anon-key>
SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>
OPENAI_API_KEY = <your-openai-key>
OPENAI_MODEL = gpt-4o
AADHAAR_PEPPER = <64-char-random-hex>
SESSION_SECRET = <64-char-random-hex>
NEXT_PUBLIC_APP_URL = https://caretrail.vercel.app
```

**IMPORTANT:** Do NOT add `NODE_TLS_REJECT_UNAUTHORIZED=0` in production!

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployment URL
4. Test all features

### Option 2: Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run
```bash
docker build -t caretrail .
docker run -p 3000:3000 --env-file .env.production caretrail
```

### Option 3: Traditional VPS (AWS, DigitalOcean, etc.)

#### Requirements
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

#### Steps
```bash
# On server
git clone <your-repo>
cd caretrail
npm install
npm run build

# Start with PM2
pm2 start npm --name "caretrail" -- start
pm2 save
pm2 startup
```

## Post-Deployment Verification

### ✅ 1. Test Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Change password

### ✅ 2. Test Document Upload
- [ ] Upload image (JPG/PNG)
- [ ] AI extraction works
- [ ] Review page loads
- [ ] Can edit extracted data
- [ ] Confirm saves to database

### ✅ 3. Test Timeline & Summary
- [ ] Timeline shows all records
- [ ] Summary aggregates correctly
- [ ] Doctor names appear correctly
- [ ] No duplicates shown

### ✅ 4. Test Duplicate Handling
- [ ] Upload same document twice
- [ ] Confirm duplicates are skipped
- [ ] Upload document with dose change
- [ ] Old medication marked discontinued

### ✅ 5. Test Performance
- [ ] Page load times < 3 seconds
- [ ] AI extraction < 10 seconds
- [ ] Database queries fast
- [ ] No console errors

## Environment Variable Generation

### Generate Secure Secrets (PowerShell)
```powershell
# Generate AADHAAR_PEPPER (64 chars)
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate SESSION_SECRET (64 chars)
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Or use Node.js
```javascript
// In Node.js console
require('crypto').randomBytes(32).toString('hex')  // Run twice for both secrets
```

## Supabase Setup Verification

### Check Database Tables
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should return:
-- patients
-- documents
-- conditions
-- medications
-- allergies
-- lab_results
-- access_log
```

### Verify Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Verify "documents" bucket exists
3. Check it's set to PRIVATE (not public)

## Performance Optimization (Production)

### 1. Enable Caching
- Vercel automatically caches static assets
- API routes are serverless (auto-scaling)

### 2. Database Indexes
Already included in schema.sql:
- Patient ID indexes on all tables
- Date indexes for timeline queries
- Aadhaar HMAC index for fast lookups

### 3. Image Optimization
Next.js automatically optimizes images

### 4. CDN
Vercel automatically uses global CDN

## Monitoring & Logging

### Vercel Dashboard
- Real-time logs
- Error tracking
- Performance metrics
- Analytics

### Supabase Dashboard
- Database query performance
- Storage usage
- API usage
- Auth metrics

## Security Checklist (Production)

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secure (not in code)
- [ ] No console.log with sensitive data
- [ ] Row Level Security enabled
- [ ] Service role key never exposed to client
- [ ] Session cookies secure and httpOnly
- [ ] CORS properly configured
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase safely)

## Rollback Plan

If deployment fails:

### Vercel
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

### Database
1. Supabase has automatic backups
2. Can restore from any point in time
3. Point-in-time recovery available

## Cost Estimation

### Free Tier (Perfect for Hackathon Demo)
- **Vercel:** Free (hobbyist plan)
- **Supabase:** Free tier (500 MB database, 1 GB storage)
- **OpenAI:** Pay-per-use (~$0.045 per document with gpt-4o)

### Expected Costs (100 users, 1000 documents/month)
- **Vercel:** Free to $20/month
- **Supabase:** Free to $25/month
- **OpenAI:** ~$45/month (1000 docs × $0.045)
- **Total:** ~$70-90/month

## Support & Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
npm run build
```

**Database connection fails:**
- Check Supabase URL and keys
- Verify service role key has full access
- Check RLS policies are correct

**AI extraction not working:**
- Verify OpenAI API key is valid
- Check API key has credits
- Review server logs for errors

**Images not uploading:**
- Check Supabase storage bucket exists
- Verify service role has storage access
- Check file size limits

## Final Pre-Deployment Command

```bash
# Run this to verify everything works locally first
npm run build
npm start

# Visit http://localhost:3000 and test all features
```

## Deployment Command (Vercel CLI - Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Will prompt for environment variables
```

## Go Live Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Database schema deployed
- [ ] Storage bucket created
- [ ] Initial deployment successful
- [ ] All features tested on production URL
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Ready for demo/presentation!

---

## 🚀 Ready to Deploy!

Follow the steps above for Vercel deployment (easiest and fastest for hackathons).

**Estimated Time:** 15-20 minutes from start to live URL

**Result:** Production-ready CareTrail app with AI-powered medical record management!
