const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 Verifying CTF Challenge Setup...\n');

// Test 1: Check if all required files exist
console.log('1. Checking required files...');
const requiredFiles = [
    'server.js',
    'setup-db.js',
    'package.json',
    'public/index.html',
    'public/assets/inspect.png',
    'public/flag/goal.txt'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✓ ${file}`);
    } else {
        console.log(`✗ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('✓ All required files present\n');
} else {
    console.log('✗ Some files are missing\n');
}

// Test 2: Check database setup
console.log('2. Checking database...');
if (fs.existsSync('ctf.db')) {
    console.log('✓ Database file exists');
    
    // Try to read the database
    try {
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database('ctf.db');
        
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
            if (err) {
                console.log('✗ Database error:', err.message);
            } else {
                console.log('✓ Database tables:', tables.map(t => t.name).join(', '));
                
                // Check secrets table
                db.all("SELECT * FROM secrets", (err, rows) => {
                    if (err) {
                        console.log('✗ Error reading secrets:', err.message);
                    } else {
                        console.log('✓ Secrets table data:', rows);
                    }
                    db.close();
                });
            }
        });
    } catch (error) {
        console.log('✗ Database setup error:', error.message);
    }
} else {
    console.log('✗ Database file not found - run "npm run setup" first');
}

// Test 3: Check stego image
console.log('\n3. Checking stego image...');
if (fs.existsSync('public/assets/inspect.png')) {
    const imageSize = fs.statSync('public/assets/inspect.png').size;
    console.log(`✓ Stego image exists (${imageSize} bytes)`);
    
    // Check for embedded payload
    const imageData = fs.readFileSync('public/assets/inspect.png');
    const hasPayload = imageData.includes('FINAL_FLAG:') && imageData.includes('HASH:');
    
    if (hasPayload) {
        console.log('✓ Payload embedded in image');
        
        // Extract and verify payload
        const payloadMatch = imageData.toString('utf8').match(/FINAL_FLAG:.*?SUCCESS:.*?(?=\x00|$)/s);
        if (payloadMatch) {
            const payload = payloadMatch[0].trim();
            console.log('✓ Payload extracted:', payload);
            
            // Verify MD5 hash
            const hashMatch = payload.match(/HASH: ([a-f0-9]{32})/);
            if (hashMatch) {
                const embeddedHash = hashMatch[1];
                const expectedHash = crypto.createHash('md5').update('flag{IN_FRONT_OF_FOUNTAIN}').digest('hex');
                
                if (embeddedHash === expectedHash) {
                    console.log('✓ MD5 hash is correct');
                    console.log('✓ Final flag: flag{IN_FRONT_OF_FOUNTAIN}');
                } else {
                    console.log('✗ MD5 hash mismatch');
                    console.log('  Embedded:', embeddedHash);
                    console.log('  Expected:', expectedHash);
                }
            }
        }
    } else {
        console.log('✗ No payload found in image');
    }
} else {
    console.log('✗ Stego image not found');
}

// Test 4: Check decoy flag
console.log('\n4. Checking decoy flag...');
if (fs.existsSync('public/flag/goal.txt')) {
    const decoyContent = fs.readFileSync('public/flag/goal.txt', 'utf8').trim();
    if (decoyContent === 'decoy{YOU_FELL_FOR_IT}') {
        console.log('✓ Decoy flag is correct');
    } else {
        console.log('✗ Decoy flag content is wrong:', decoyContent);
    }
} else {
    console.log('✗ Decoy flag file not found');
}

// Test 5: Check package.json
console.log('\n5. Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['express', 'sqlite3', 'express-rate-limit', 'cors', 'body-parser'];
    
    let depsOk = true;
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✓ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`✗ ${dep} - MISSING`);
            depsOk = false;
        }
    });
    
    if (depsOk) {
        console.log('✓ All required dependencies present');
    }
} catch (error) {
    console.log('✗ Error reading package.json:', error.message);
}

// Test 6: Check server.js for vulnerabilities
console.log('\n6. Checking server vulnerabilities...');
try {
    const serverCode = fs.readFileSync('server.js', 'utf8');
    
    if (serverCode.includes("'${username}'") && serverCode.includes("'${password}'")) {
        console.log('✓ SQL injection vulnerability present (intentional)');
    } else {
        console.log('✗ SQL injection vulnerability not found');
    }
    
    if (serverCode.includes('rateLimit')) {
        console.log('✓ Rate limiting implemented');
    } else {
        console.log('✗ Rate limiting not found');
    }
    
    if (serverCode.includes('logRequest')) {
        console.log('✓ Request logging implemented');
    } else {
        console.log('✗ Request logging not found');
    }
} catch (error) {
    console.log('✗ Error checking server.js:', error.message);
}

console.log('\n🎯 Setup verification complete!');
console.log('\nTo start the challenge:');
console.log('1. Run: npm install');
console.log('2. Run: npm run setup');
console.log('3. Run: npm start');
console.log('4. Open: http://localhost:3000');
console.log('\nTo test the challenge:');
console.log('1. Use SQL injection: username=foo\' UNION SELECT 1, note, \'admin\' FROM secrets --');
console.log('2. Download the stego image from the revealed path');
console.log('3. Extract payload using: exiftool inspect.png or strings inspect.png');
console.log('4. Crack the MD5 hash to get "FOUNTAIN"');
console.log('5. Submit flag: flag{IN_FRONT_OF_FOUNTAIN}');
