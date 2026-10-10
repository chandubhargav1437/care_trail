# CareTrail 🏥

**AI-Powered Personal Health Record Management System**

CareTrail is a secure, intelligent platform that helps patients manage their medical records using AI to extract information from documents like prescriptions, lab reports, and discharge summaries.

## ✨ Key Features

### 🤖 AI Document Extraction
- Upload medical documents (images or PDFs)
- AI automatically extracts medications, diagnoses, lab results
- Two-step extraction ensures accurate doctor name recognition
- Review and edit before saving

### 🔒 Secure & Private
- Aadhaar-based authentication (HMAC hashed)
- Patient-verified data
- Session-based security
- Encrypted storage

### 📊 Smart Organization
- **Timeline View:** Chronological medical history
- **Summary View:** Doctor-friendly medical overview
- **Duplicate Detection:** Automatically handles duplicate records
- **Medication Tracking:** Tracks dose changes and discontinued medications

### 🏥 Healthcare Provider Ready
- Professional medical summaries
- Shareable time-limited access links
- Complete audit trail
- Access logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd caretrail
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
```

4. **Setup database:**
- Go to your Supabase project
- Open SQL Editor
- Run the SQL from `supabase/schema.sql`

5. **Run development server:**
```bash
npm run dev
```

6. **Open browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
caretrail/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── extract/      # AI document extraction
│   │   ├── timeline/     # Timeline data
│   │   └── summary/      # Summary aggregation
│   ├── dashboard/        # Main dashboard
│   ├── upload/           # Document upload
│   ├── review/           # Review extracted data
│   ├── timeline/         # Timeline view
│   └── summary/          # Medical summary
├── lib/                   # Utilities & helpers
│   ├── auth.ts           # Authentication logic
│   ├── session.ts        # Session management
│   ├── supabase-*.ts     # Supabase clients
│   └── validation.ts     # Input validation
├── supabase/             # Database
│   └── schema.sql        # Database schema
├── docs/                 # Documentation
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── ...
├── public/               # Static assets
├── .env.example          # Environment template
└── package.json          # Dependencies
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **AI:** OpenAI GPT-4o Vision API
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🎯 Core Workflows

### 1. Patient Registration & Login
- Register with name, Aadhaar number, password
- Aadhaar is HMAC hashed (never stored plaintext)
- Session-based authentication

### 2. Document Upload & Extraction
- Upload medical document (JPG, PNG, or PDF)
- **Step 1:** AI extracts doctor name and hospital
- **Step 2:** AI extracts medications, conditions, lab results
- Review and edit extracted information
- Confirm to save to database

### 3. View Medical History
- **Timeline:** All records sorted chronologically
- **Summary:** Aggregated view of active conditions, medications, allergies
- **Dashboard:** Quick stats and recent activity

### 4. Smart Duplicate Handling
- Duplicate medications automatically skipped
- Dose changes tracked (old marked discontinued, new added)
- Prevents data clutter

## 🔐 Security Features

- ✅ Aadhaar HMAC hashing (with pepper)
- ✅ Password hashing with bcrypt
- ✅ Session-based authentication
- ✅ HTTP-only secure cookies
- ✅ Row Level Security (RLS) in database
- ✅ Service role key never exposed to client
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention

## 📊 Database Schema

### Tables
- **patients:** User accounts
- **documents:** Uploaded documents metadata
- **conditions:** Medical conditions/diagnoses
- **medications:** Prescribed medications
- **allergies:** Patient allergies
- **lab_results:** Laboratory test results
- **access_log:** Access audit trail

See full schema: `supabase/schema.sql`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

**Detailed guide:** [docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md](docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md)

### Environment Variables (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
OPENAI_API_KEY=<your-key>
OPENAI_MODEL=gpt-4o
AADHAAR_PEPPER=<64-char-random-hex>
SESSION_SECRET=<64-char-random-hex>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📖 Documentation

All detailed documentation is in the `/docs` folder:

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[Deployment Checklist](docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md)** - Complete deployment guide
- **[Testing Guide](docs/TESTING_GUIDE.md)** - How to test all features
- **[Implementation Details](docs/)** - Technical documentation

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test workflow:
1. Register new patient
2. Login
3. Upload medical document (use image format for best results)
4. Review extracted data
5. Confirm and save
6. Check Timeline and Summary pages
```

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Features in Detail

### AI Extraction (Two-Step Process)
1. **First Call:** Dedicated extraction of doctor name and hospital
2. **Second Call:** Full medical data extraction using pre-identified names
3. **Result:** Accurate, consistent doctor names across all medications

### Duplicate Detection
- **Medications:** Same name + same dose = skip
- **Medications:** Same name + different dose = mark old as discontinued, add new
- **Conditions:** Same name = skip duplicate
- **Allergies:** Same substance = skip duplicate
- **Lab Results:** Always add (they're timestamped)

### Timeline View
- Chronological display of all medical records
- Filter by type (conditions, medications, allergies, lab results)
- Visual icons and color coding
- Provider information for each record

### Summary View
- Patient information header
- Active conditions section
- Current medications with prescriber info
- Known allergies with severity
- Recent lab results
- Export and share options

## 🤝 Contributing

This is a hackathon project. For questions or contributions, please open an issue.

## 📄 License

MIT License - feel free to use for educational and hackathon purposes

## 🏆 Hackathon Submission

**Project Name:** CareTrail  
**Category:** Healthcare / AI  
**Tech Stack:** Next.js, TypeScript, Supabase, OpenAI  

**Key Innovation:**
- Two-step AI extraction for accurate doctor name recognition
- Intelligent duplicate detection and medication tracking
- Patient-verified, doctor-ready medical records

---

**Built with ❤️ for better healthcare data management**

For detailed documentation, see the [docs/](docs/) folder.
