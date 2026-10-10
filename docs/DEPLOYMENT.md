# CareTrail Deployment Guide

## Quick Start (Local Development)

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

## Demo Features

The application is pre-configured with simulated data and works without any external services:

- **Landing Page**: Introduction and features (`/`)
- **Dashboard**: Overview with stats (`/dashboard`)
- **Upload**: Document upload with simulated AI extraction (`/upload`)
- **Review**: Edit and confirm extracted information (`/review`)
- **Timeline**: Chronological health history (`/timeline`)
- **Summary**: Doctor-friendly medical summary (`/summary`)
- **Share**: Create time-limited sharing links (`/share`)

## Production Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account
- Supabase project (optional for full functionality)
- OpenAI API key (optional for real AI extraction)

### Steps

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables:**

For demo mode:
```env
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_key
SUPABASE_SERVICE_ROLE_KEY=demo_service_key
OPENAI_API_KEY=demo_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

For production with real services:
```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
OPENAI_API_KEY=<your-openai-key>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Supabase Setup (Optional)

If you want to use real database storage:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL in `database-schema.sql` in your Supabase SQL Editor

3. Update environment variables with your Supabase credentials

4. Enable Row Level Security policies (included in schema)

5. Create a private storage bucket named "documents"

## Build Commands

- **Development:** `npm run dev`
- **Production build:** `npm run build`
- **Start production server:** `npm start`
- **Lint:** `npm run lint`

## Testing the Deployment

1. Visit the landing page
2. Click "Try Demo" or navigate to `/dashboard`
3. Test the upload workflow:
   - Upload any PDF or image
   - Review extracted information
   - Confirm and save
   - View in timeline
4. Create a sharing link from `/share`
5. View the professional summary at `/summary`

## Performance Optimization

The application is optimized for production with:
- Static page generation where possible
- Responsive images
- Minimal bundle size
- Efficient client-side state management

## Security Considerations

For production deployment:
- Enable HTTPS (automatic on Vercel)
- Set up proper CORS policies
- Use real authentication (Supabase Auth)
- Enable Row Level Security
- Use secure environment variables
- Implement rate limiting for APIs
- Add content security policies

## Monitoring

On Vercel, you automatically get:
- Deployment logs
- Analytics
- Error tracking
- Performance metrics

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check for TypeScript errors with `npm run build`

### Runtime Errors
- Verify environment variables are set correctly
- Check browser console for client-side errors
- Review Vercel logs for server-side issues

### Demo Data Not Showing
- Clear browser cache
- Check that you're accessing the correct routes
- Verify session storage is enabled in browser

## Support

For issues or questions about this project:
- Check the README.md for comprehensive documentation
- Review the code comments
- Open an issue in the repository

---

**Ready to deploy!** Follow the steps above to get CareTrail running in production.
