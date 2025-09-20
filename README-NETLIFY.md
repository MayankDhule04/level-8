# CTF Challenge - Netlify Deployment Guide

## Overview
This CTF challenge has been configured for deployment on Netlify as a serverless application.

## Files Structure
```
├── netlify.toml                 # Netlify configuration
├── netlify/functions/api.js     # Serverless function for API endpoints
├── public/                      # Static files (HTML, CSS, JS, images)
│   ├── index.html              # Login page
│   ├── dashboard.html          # Main challenge page
│   ├── _redirects              # Netlify redirects
│   └── assets/                 # Challenge images and files
└── package.json                # Updated with Netlify scripts
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Base directory**: `.` (root)

### 3. Environment Variables
In Netlify dashboard, go to Site settings > Environment variables and add:
```
FLAG_REAL=flag{Url/inspect.png}
NODE_ENV=production
```

### 4. Deploy
Netlify will automatically deploy when you push to your main branch.

## Challenge Flow
1. **Login Page**: `/index.html` - Users start here
2. **Dashboard**: `/dashboard.html` - Main challenge interface
3. **API Endpoints**: Handled by Netlify Functions
   - `/api/login` - SQL injection vulnerability
   - `/api/submit` - Flag submission
   - `/api/hint/:level` - Hints for each level
   - `/api/ui-log` - UI event logging

## Challenge Details
- **SQL Injection**: Login form is vulnerable to SQL injection
- **Hidden Data**: MD5 hash fragments in HTML, Base64 fragments in CSS/JS
- **Steganography**: Image contains hidden MD5 hash
- **Final Flag**: `flag{Url/inspect.png}`

## Local Development
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

## Security Notes
- Rate limiting is implemented
- CORS is configured for cross-origin requests
- SQL injection is intentional for the CTF challenge
- Environment variables are used for sensitive data

## Troubleshooting
- Check Netlify function logs in the dashboard
- Verify environment variables are set correctly
- Ensure all static files are in the `public` directory
- Check that `_redirects` file is properly configured
