# 🚀 Deploy CareTrail to Vercel NOW!

Follow these steps exactly to deploy your application.

## ✅ Prerequisites Checklist

- [x] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Supabase schema deployed (run `supabase/schema.sql`)
- [ ] Supabase storage bucket "documents" created (private)
- [ ] OpenAI API key ready
- [ ] Vercel account created

---

## 🔥 STEP 1: Import Project to Vercel

### 1.1 Go to Vercel
🔗 https://vercel.com/new

### 1.2 Import Git Repository
- Click **"Import Git Repository"**
- Find your **`caretrail`** repository
- Click **"Import"**

### 1.3 Configure Project
Leave these as default:
- **Framework Preset:** Next.js ✅ (auto-detected)
- **Root Directory:** `./` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅

**⚠️ DO NOT CLICK DEPLOY YET!**

---

## 🔑 STEP 2: Add Environment Variables

**CRITICAL:** Scroll down to **"Environment Variables"** section

### 2.1 Get Your Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings → API**
4. Copy these values:

```
Project URL:          https://xxxxx.supabase.co
anon/public key:      eyJhbG...
service_role key:     eyJhbG... (longer key)
```

### 2.2 Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Copy your API key: `sk-...`

### 2.3 Add Each Variable in Vercel

Click **"Add"** for each environment variable:

#### Variable 1
```
Name:  SUPABASE_URL
Value: https://xxxxx.supabase.co
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 2
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbG... (your service role key - longer)
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 3
```
Name:  OPENAI_API_KEY
Value: sk-... (your OpenAI key)
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 4
```
Name:  OPENAI_MODEL
Value: gpt-4o
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 5
```
Name:  AADHAAR_PEPPER
Value: c6a901ed87b5234fc6a901ed87b5234fc6a901ed87b5234fc6a901ed87b5234f
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 6
```
Name:  SESSION_SECRET
Value: bfa8073d541269ecbfa8073d541269ecbfa8073d541269ecbfa8073d541269ec
```
Check: ✅ Production ✅ Preview ✅ Development

#### Variable 7 (Temporary - we'll update this)
```
Name:  NEXT_PUBLIC_APP_URL
Value: https://caretrail.vercel.app
```
Check: ✅ Production ✅ Preview ✅ Development

---

## 🎯 STEP 3: Deploy!

### 3.1 Click "Deploy" Button

Vercel will:
- Install dependencies (~1 minute)
- Build your project (~2 minutes)
- Deploy to production (~30 seconds)

**Total time: ~3-4 minutes**

### 3.2 Wait for Build to Complete

You'll see:
```
✓ Building...
✓ Uploading...
✓ Deployment Ready!
```

### 3.3 Copy Your Deployment URL

Vercel will give you a URL like:
```
https://caretrail-abc123xyz.vercel.app
```

---

## 🔄 STEP 4: Update APP_URL

### 4.1 Go to Project Settings
- Click your project name
- Go to: **Settings → Environment Variables**

### 4.2 Edit NEXT_PUBLIC_APP_URL
- Find `NEXT_PUBLIC_APP_URL`
- Click **"Edit"**
- Update value to your actual Vercel URL:
  ```
  https://caretrail-abc123xyz.vercel.app
  ```
- Click **"Save"**

### 4.3 Redeploy
- Go to: **Deployments** tab
- Click **"Redeploy"** button on the latest deployment
- Wait ~1 minute for redeployment

---

## ✅ STEP 5: Verify Deployment

### 5.1 Test Homepage
Visit: `https://your-app-name.vercel.app`

Should show: CareTrail landing page ✅

### 5.2 Test Registration
1. Click "Try Demo" or go to `/register`
2. Create test account:
   - Name: Test User
   - Aadhaar: 123456789012
   - Password: Test123!
3. Click Register

Should redirect to dashboard ✅

### 5.3 Test Login
1. Logout (top right)
2. Login with same credentials
3. Should see dashboard ✅

### 5.4 Test Upload (Critical!)
1. Click "Upload Document"
2. Upload a medical document image (JPG/PNG)
3. Wait for AI extraction (~10 seconds)
4. Should see extracted data ✅

### 5.5 Test Timeline & Summary
1. Confirm extracted data
2. Go to Timeline page
3. Should see saved record ✅
4. Go to Summary page
5. Should see aggregated data ✅

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Fails
**Error:** `Module not found` or `Type error`

**Solution:**
```bash
# Test locally first
npm run build
```
If it works locally, push the fix and redeploy.

### Issue 2: Environment Variables Not Working
**Error:** `Missing environment variable`

**Solution:**
- Verify all 8 variables are added
- Check spelling (case-sensitive!)
- Make sure "Production" is checked
- Redeploy after adding variables

### Issue 3: Database Connection Error
**Error:** `Failed to connect to Supabase`

**Solution:**
- Verify Supabase URL is correct (should end with `.supabase.co`)
- Check anon key and service role key are correct
- Make sure schema is deployed: Run `supabase/schema.sql`
- Check storage bucket "documents" exists

### Issue 4: AI Extraction Not Working
**Error:** `Extraction failed` or `Invalid API key`

**Solution:**
- Verify OpenAI API key is correct
- Check API key has credits: https://platform.openai.com/usage
- Make sure `OPENAI_MODEL` is set to `gpt-4o`

### Issue 5: 500 Internal Server Error
**Solution:**
- Check Vercel logs: Project → Deployments → Click deployment → "View Function Logs"
- Look for error messages
- Common causes:
  - Missing environment variables
  - Database connection issues
  - OpenAI API errors

---

## 📊 Monitor Your Deployment

### Vercel Dashboard
🔗 https://vercel.com/dashboard

**Check:**
- Deployment status
- Build logs
- Runtime logs (under Functions)
- Analytics
- Error tracking

### Supabase Dashboard
🔗 https://supabase.com/dashboard

**Check:**
- Database activity
- Storage usage
- API requests
- Error logs

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Homepage loads without errors
- ✅ Can register new account
- ✅ Can login successfully
- ✅ Can upload medical document
- ✅ AI extraction works (shows extracted data)
- ✅ Can confirm and save data
- ✅ Timeline shows saved records
- ✅ Summary shows aggregated data
- ✅ No console errors in browser
- ✅ No 500 errors in Vercel logs

---

## 🚀 Your App is LIVE!

Share your deployment:
```
🌐 CareTrail: https://your-app-name.vercel.app
📱 Demo Account: (create one on registration page)
🎯 Features: AI-powered medical record management
```

---

## 📝 Next Steps After Deployment

1. **Test thoroughly** - Go through all workflows
2. **Fix any issues** - Check logs, fix, redeploy
3. **Add custom domain** (optional) - Vercel Settings → Domains
4. **Enable analytics** (optional) - Vercel Settings → Analytics
5. **Prepare demo script** - For hackathon presentation

---

## 🆘 Need Help?

### Check Logs
- **Vercel:** Project → Deployments → View Function Logs
- **Browser:** F12 → Console tab
- **Supabase:** Project → Logs

### Common Commands
```bash
# Test build locally
npm run build

# Start production server locally
npm start

# Check for TypeScript errors
npx tsc --noEmit
```

---

## ✨ Congratulations!

Your CareTrail application is now **LIVE** on the internet! 🎉

**Deployment URL:** `https://your-app-name.vercel.app`

Ready to impress at the hackathon! 🏆
