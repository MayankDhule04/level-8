# SQL Injection CTF Challenge - Vercel Deployment

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub** (already done):
   ```bash
   git add .
   git commit -m "Initial commit: Enhanced SQL Injection CTF Challenge"
   git branch -M main
   git remote add origin https://github.com/MayankDhule04/level-8.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository: `MayankDhule04/level-8`
   - Vercel will auto-detect the Node.js project
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

## 🎯 Challenge Features

- **SQL Injection**: Login bypass with `' OR '1`
- **Progressive UI**: Buttons appear step by step
- **Advanced Tools**: Steganography, cryptography, network analysis
- **Real-time Stats**: Timer, progress tracking
- **Flag Submission**: Interactive validation

## 🏆 Solution

The correct flag is: `flag{Url/inspect.png}`

### Challenge Flow:
1. SQL injection → Extract image path
2. Find hidden hash fragments in code
3. Decode Base64 → `Url/inspect.png`
4. Submit flag

## 🔧 Configuration

The `vercel.json` file is configured for:
- Node.js serverless functions
- Static file serving from `/public`
- API routes under `/api/`
- Environment variables

## 📁 Project Structure

```
├── server.js              # Main Express server
├── public/                # Static files
│   ├── index.html         # Login page
│   ├── dashboard.html     # Forensic dashboard
│   ├── app.js            # Client-side logic
│   ├── style.css         # Styling
│   └── assets/           # Images and resources
├── setup-db.js           # Database initialization
├── vercel.json           # Vercel configuration
└── README-VERCEL.md      # This file
```

## 🌐 Live Demo

Once deployed, your challenge will be available at:
`https://level-8-{random-id}.vercel.app`

## 🎮 How to Play

1. Visit the deployed URL
2. Try to login (hint: look at page source)
3. Use the forensic tools progressively
4. Extract hidden data
5. Submit the correct flag

Enjoy the challenge! 🎯
