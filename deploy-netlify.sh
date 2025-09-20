#!/bin/bash

# CTF Challenge - Netlify Deployment Script
echo "🚀 Deploying CTF Challenge to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify:"
    netlify login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Set environment variables in Netlify dashboard:"
echo "   - FLAG_REAL=flag{Url/inspect.png}"
echo "   - NODE_ENV=production"
echo "2. Test the challenge at your Netlify URL"
echo "3. Share the challenge with participants"

echo "🎯 Challenge URL will be available in Netlify dashboard"
