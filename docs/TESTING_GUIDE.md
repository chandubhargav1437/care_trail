# CareTrail Testing Guide

## 🚀 Quick Start - Testing the Application

### Prerequisites ✅
- ✅ Database tables created in Supabase
- ✅ Storage bucket `documents` created in Supabase (set to Private)
- ✅ Environment variables configured in `.env.local`
- ✅ Development server running (`npm run dev`)

### Testing Workflow

## 1. Register a New Patient

1. Open http://localhost:3000
2. Click **"Get Started"** or **"Register"**
3. Fill in the registration form:
   - **Name**: John Doe
   - **Health ID**: `123456789012` (12 digits)
   - **Password**: `SecurePass123`
   - **Confirm Password**: `SecurePass123`
4. Click **"Create Account"**
5. You should be redirected to the login page with success message

## 2. Login as Patient

1. On the login page (http://localhost:3000/login)
2. Make sure **"Patient"** tab is selected
3. Enter credentials:
   - **Health ID**: `123456789012`
   - **Password**: `SecurePass123`
4. Click **"Sign In"**
5. You should be redirected to the dashboard

## 3. Test Dashboard

Once logged in, you should see:
- ✅ Your name and masked Health ID (XXXX XXXX 9012)
- ✅ Stats cards showing 0 documents, conditions, medications, allergies
- ✅ Quick action buttons:
  - Upload Document
  - View Timeline
  - Medical Summary
  - Share Records
- ✅ Links to Settings and Access Log
- ✅ Logout button

## 4. Test Access Log

1. From dashboard, click **"View Access History"** under "Access Log" section
2. You should see:
   - ✅ At least one entry: "Patient Login" with "success" status
   - ✅ Timestamp of your login

## 5. Test Settings (Change Password)

1. From dashboard, click **"Change Password"** under "Account Settings"
2. Fill in the form:
   - **Current Password**: `SecurePass123`
   - **New Password**: `NewSecure456`
   - **Confirm New Password**: `NewSecure456`
3. Click **"Change Password"**
4. You should see success message
5. Test logout and login again with the new password to verify it worked

## 6. Test Doctor Access

1. **Logout** from patient account
2. Go to login page (http://localhost:3000/login)
3. Click **"Doctor"** tab
4. Fill in the form:
   - **Patient Health ID**: `123456789012` (the patient you created)
   - **Patient Password**: `NewSecure456` (or original if you didn't change it)
   - **Your Name (Doctor)**: `Dr. Smith`
5. Click **"Sign In"**
6. You should be redirected to dashboard with:
   - ✅ Purple banner showing "Dr. Smith (Read-Only)"
   - ✅ Patient's data displayed
   - ✅ NO "Upload Document" or "Share Records" buttons (read-only)
7. Logout and login as patient again
8. Check access log - you should see a new entry for "Doctor Access: Dr. Smith"

## 7. Test Upload Feature (Next Step)

The upload feature will:
1. Accept PDF/image files
2. Upload to Supabase Storage
3. Send to OpenAI Vision API for extraction
4. Show extracted data for review
5. Save confirmed data to database

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check that `.env.local` has correct values
- Restart the dev server: Stop and run `npm run dev` again
- Clear browser cookies and try again

### Database Errors
- Verify all tables were created in Supabase SQL Editor
- Check Supabase service role key is complete and correct
- Look at browser console (F12) for detailed error messages

### Environment Variable Errors
- Make sure `.env.local` is in the `caretrail` folder
- Restart dev server after changing `.env.local`
- Check all values are uncommented (no `#` at start of line)

### Storage Errors
- Verify `documents` bucket exists in Supabase Storage
- Make sure bucket is set to **Private** (not public)

---

## ✅ What's Working Now

✅ **Authentication System**
- Patient registration with Health ID validation
- Patient login with bcrypt password hashing
- Doctor login using patient credentials
- Session management with JWT (8 hours patient, 30 minutes doctor)
- Account lockout after 5 failed attempts (15 minutes)
- Secure Health ID storage (HMAC-SHA256, never stored in plain text)

✅ **Dashboard**
- Real-time stats loading from Supabase
- Patient/Doctor role indicator
- Masked Health ID display (XXXX XXXX 9012)
- Quick action links

✅ **Settings**
- Password change functionality
- Password validation (minimum 8 characters)
- Current password verification

✅ **Access Log**
- All login attempts tracked
- Shows success/failure status
- Shows role (patient/doctor) and doctor name
- Chronological order (newest first)

✅ **Security**
- Protected routes (middleware redirects unauthorized access)
- Session verification
- Role-based access control
- Logout functionality

---

## 🔜 Next Features to Implement

1. **Upload & Extract** - Upload documents, OpenAI extraction, review interface
2. **Timeline** - Chronological view of all medical records
3. **Summary** - Professional medical summary generation
4. **Share** - Secure sharing with time-limited links
5. **Review Page** - Edit and confirm extracted data before saving

---

## 📝 Test Checklist

- [ ] Register new patient account
- [ ] Login as patient
- [ ] View dashboard with correct stats
- [ ] Check access log shows login entry
- [ ] Change password successfully
- [ ] Logout and login with new password
- [ ] Login as doctor with patient credentials
- [ ] Verify doctor sees read-only banner
- [ ] Check access log shows doctor access entry
- [ ] Logout from doctor session
- [ ] Login back as patient

---

## 🎯 Current Database State

After testing, your Supabase database should have:

**patients table:**
- 1 patient record with hashed Health ID and password

**access_log table:**
- Multiple entries showing:
  - Patient successful logins
  - Doctor successful logins
  - Any failed login attempts (if you tested wrong passwords)

**Other tables:**
- Empty (will be populated when upload feature is implemented)

---

## 🔗 URLs

- Landing Page: http://localhost:3000
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Settings: http://localhost:3000/settings
- Access Log: http://localhost:3000/access-log
- Timeline: http://localhost:3000/timeline (not yet integrated with real data)
- Summary: http://localhost:3000/summary (not yet integrated with real data)
- Upload: http://localhost:3000/upload (not yet integrated with real data)
- Share: http://localhost:3000/share (not yet integrated with real data)
