# CareTrail - Quick Start Guide

## 🚀 Application is Running!

**Local URL:** http://localhost:3000  
**Network URL:** http://192.168.56.1:3000

---

## 🎯 5-Minute Demo Workflow

### 1. **Start at Dashboard** (http://localhost:3000/dashboard)
- See real-time stats (all zeros initially)
- Notice the "Real-Time Functional Demo" banner
- Click "Upload Document"

### 2. **Upload a Document** (http://localhost:3000/upload)
- Click "Select File"
- Choose **any** PDF or image file
- Click "Upload & Extract"
- Wait 2 seconds for "AI extraction"

### 3. **Review & Confirm** (http://localhost:3000/review)
- See extracted information:
  - Conditions (blue)
  - Medications (purple)
  - Allergies (red)
  - Lab Results (green)
- Scroll through all fields
- Click "Confirm & Save All" at top or bottom

### 4. **View Timeline** (http://localhost:3000/timeline)
- ✅ See success message
- See your record in the timeline
- Click the trash icon to delete (try it!)
- Observe instant update
- Click "Add Record" to upload more

### 5. **Check Summary** (http://localhost:3000/summary)
- Professional medical summary view
- See conditions, medications, allergies, labs
- All data organized by type
- Click "Share" button

### 6. **Create Share Link** (http://localhost:3000/share)
- Click "Create Link"
- Enter label: "Demo Doctor Visit"
- Select scopes: Check all boxes
- Set expiry: 24 hours
- Click "Create Secure Link"
- Click "Copy" button
- **Now click "Revoke"** → See it move to revoked section!

### 7. **Return to Dashboard** (http://localhost:3000/dashboard)
- Stats updated with real numbers!
- Recent activity shows your records
- Everything synced in real-time

---

## 🧪 Test Real-Time Features

### Test 1: Multiple Uploads
```
1. Upload 3 different files
2. Confirm each one
3. Go to timeline → See 3x records
4. Go to dashboard → See updated counts
```

### Test 2: Delete & Update
```
1. Go to timeline
2. Delete a record (trash icon)
3. Immediately go to dashboard
4. Count decreases instantly!
5. Check summary → Record gone there too
```

### Test 3: Share Links
```
1. Create 3 different share links
2. Set different scopes for each
3. Set different expiry times
4. Copy one link
5. Revoke one link
6. See "Active Shares" count on dashboard update
```

### Test 4: Fresh Start
```
1. Open browser console (F12)
2. Type: localStorage.clear()
3. Press Enter
4. Reload page
5. Everything is empty!
6. Start uploading again
```

---

## 📋 Key Pages

| URL | Purpose | What to Test |
|-----|---------|--------------|
| `/` | Landing Page | Read features, click "Try Demo" |
| `/dashboard` | Main Hub | Real-time stats, quick actions |
| `/upload` | Add Records | File validation, extraction |
| `/review` | Confirm Data | Edit fields, save |
| `/timeline` | History View | Delete records, see updates |
| `/summary` | Professional View | Doctor-friendly format |
| `/share` | Manage Sharing | Create, copy, revoke links |

---

## 💡 Features to Highlight

### ✅ Real-Time Updates
- Upload → Instantly appears in timeline
- Delete → Immediately removed everywhere
- Create link → Shows up instantly
- Revoke → Moves to revoked section immediately

### ✅ Data Persistence
- Close browser
- Reopen http://localhost:3000/dashboard
- All your data is still there!

### ✅ Cross-Page Sync
- Open dashboard in one tab
- Upload document in another tab
- Reload dashboard → See new record!

### ✅ Professional UI
- Color-coded information
- Clean, modern design
- Smooth animations
- Responsive layout

---

## 🎥 For Demo Video

### Recommended Recording Flow (3 minutes):

**0:00-0:30 - Introduction**
- Show landing page
- Explain the problem
- Click "Try Demo"

**0:30-1:30 - Upload & Review**
- Show dashboard (empty state)
- Upload a document
- Show extraction animation
- Review fields
- Confirm and save

**1:30-2:15 - Timeline & Summary**
- Show timeline with record
- Delete one record (show instant update)
- Upload one more
- Show summary page

**2:15-2:45 - Sharing**
- Create share link
- Copy link
- Show revocation
- Explain security

**2:45-3:00 - Wrap Up**
- Show dashboard with updated stats
- Highlight real-time features
- Mention it's a prototype

---

## 🛠️ Developer Info

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Context API
- LocalStorage (no backend needed!)

### Data Location
```javascript
// All in browser localStorage:
localStorage.getItem('documents')
localStorage.getItem('medical_records')
localStorage.getItem('share_links')
```

### Clear Everything
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### Check Data
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('medical_records') || '[]'))
```

---

## 🎨 Color Codes

- 🔵 **Blue** = Conditions
- 🟣 **Purple** = Medications
- 🔴 **Red** = Allergies
- 🟢 **Green** = Lab Results

---

## 🚨 Troubleshooting

### Nothing showing on dashboard?
→ Upload your first document!

### Upload not working?
→ Make sure file is PDF, JPG, or PNG under 10MB

### Data disappeared?
→ Check if localStorage was cleared
→ Try uploading again

### Share link not working?
→ Check if revoked or expired
→ Create a new one

---

## 📞 Quick Commands

### Stop Server
```bash
Ctrl + C in terminal
```

### Restart Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## ✨ What Makes This Special

1. **No Backend Required** - Everything works in browser
2. **Instant Updates** - See changes immediately
3. **Full CRUD** - Create, Read, Update, Delete all work
4. **Real Persistence** - Data survives browser refresh
5. **Professional UI** - Ready for demo video
6. **Complete Workflow** - End-to-end functionality

---

## 🎯 Perfect for Hackathon Because:

✅ Works without internet (after initial load)  
✅ No database setup required  
✅ Instant deployment ready  
✅ Demo-ready with real functionality  
✅ Judges can test without accounts  
✅ Shows technical competence  
✅ Professional appearance  
✅ Complete feature set  

---

## 🎉 You're Ready to Demo!

Open **http://localhost:3000** and start exploring!

All features are fully functional and ready for your hackathon submission. 🚀
