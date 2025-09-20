@echo off
REM CTF Challenge - Netlify Deployment Script for Windows

echo 🚀 Deploying CTF Challenge to Netlify...

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Netlify CLI not found. Installing...
    npm install -g netlify-cli
)

REM Check if user is logged in to Netlify
netlify status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Netlify:
    netlify login
)

REM Build the project
echo 📦 Building project...
npm run build

REM Deploy to Netlify
echo 🌐 Deploying to Netlify...
netlify deploy --prod

echo ✅ Deployment complete!
echo 📋 Next steps:
echo 1. Set environment variables in Netlify dashboard:
echo    - FLAG_REAL=flag{Url/inspect.png}
echo    - NODE_ENV=production
echo 2. Test the challenge at your Netlify URL
echo 3. Share the challenge with participants

echo 🎯 Challenge URL will be available in Netlify dashboard
pause
