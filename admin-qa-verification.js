#!/usr/bin/env node

/**
 * Admin QA Script for Level 8 Dashboard Clue Verification
 * 
 * This script verifies that all encoded fragments are properly placed
 * and can be decoded to form the correct pointer to the stego image.
 * 
 * Usage: node admin-qa-verification.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Level 8 Dashboard Clue Verification\n');
console.log('=' .repeat(50));

// Step 1: Check for markers in files
function checkMarkers() {
    console.log('\n📋 Step 1: Checking for required markers...');
    
    const files = [
        { path: 'public/dashboard.html', markers: ['MARKER: S3_DEV_A'] },
        { path: 'public/style.css', markers: ['MARKER: S3_DEV_B', 'MARKER: S3_DEV_C'] },
        { path: 'public/app.js', markers: ['MARKER: S3_DEV_D', 'MARKER: S3_DEV_E', 'MARKER: S3_INSTR'] }
    ];
    
    let allMarkersFound = true;
    
    files.forEach(file => {
        if (fs.existsSync(file.path)) {
            const content = fs.readFileSync(file.path, 'utf8');
            console.log(`\n📄 ${file.path}:`);
            
            file.markers.forEach(marker => {
                if (content.includes(marker)) {
                    console.log(`  ✅ ${marker}`);
                } else {
                    console.log(`  ❌ ${marker} - MISSING`);
                    allMarkersFound = false;
                }
            });
        } else {
            console.log(`\n❌ ${file.path} - FILE NOT FOUND`);
            allMarkersFound = false;
        }
    });
    
    return allMarkersFound;
}

// Step 2: Extract and decode fragments
function extractAndDecodeFragments() {
    console.log('\n📋 Step 2: Extracting and decoding fragments...');
    
    try {
        // Extract Fragment A from HTML
        const htmlContent = fs.readFileSync('public/dashboard.html', 'utf8');
        const fragmentAMatch = htmlContent.match(/<!-- MARKER: S3_DEV_A\s*\n\s*([A-Za-z0-9+/=]+)\s*\n\s*-->/);
        if (!fragmentAMatch) {
            throw new Error('Fragment A not found in HTML');
        }
        const fragmentA = Buffer.from(fragmentAMatch[1], 'base64').toString('ascii');
        console.log(`  Fragment A: ${fragmentA}`);
        
        // Extract Fragments B and C from CSS
        const cssContent = fs.readFileSync('public/style.css', 'utf8');
        const fragmentBMatch = cssContent.match(/--s3-b:\s*"([A-Za-z0-9+/=]+)"/);
        const fragmentCMatch = cssContent.match(/--s3-c:\s*"([A-Za-z0-9+/=]+)"/);
        
        if (!fragmentBMatch || !fragmentCMatch) {
            throw new Error('Fragments B or C not found in CSS');
        }
        
        const fragmentB = fragmentBMatch[1];
        const fragmentC = fragmentCMatch[1];
        console.log(`  Fragment B: ${fragmentB}`);
        console.log(`  Fragment C: ${fragmentC}`);
        
        // Decode B + C
        const combinedBC = fragmentB + fragmentC;
        const decodedBC = Buffer.from(combinedBC, 'base64').toString('ascii');
        console.log(`  Combined B+C: ${combinedBC}`);
        console.log(`  Decoded B+C: ${decodedBC}`);
        
        // Apply ROT13 to decoded B+C
        const fragmentBC = rot13(decodedBC);
        console.log(`  Fragment BC (ROT13): ${fragmentBC}`);
        
        // Extract Fragments D and E from JS
        const jsContent = fs.readFileSync('public/app.js', 'utf8');
        const fragmentDMatch = jsContent.match(/const _s3d = "([^"]+)"/);
        const fragmentEMatch = jsContent.match(/const _s3e = "([^"]+)"/);
        
        if (!fragmentDMatch || !fragmentEMatch) {
            throw new Error('Fragments D or E not found in JS');
        }
        
        const fragmentD = fragmentDMatch[1];
        const fragmentE = fragmentEMatch[1];
        console.log(`  Fragment D (hex): ${fragmentD}`);
        console.log(`  Fragment E (rot13): ${fragmentE}`);
        
        // Decode D (hex) and E (rot13)
        const decodedD = Buffer.from(fragmentD, 'hex').toString('ascii');
        const decodedE = Buffer.from(fragmentE, 'base64').toString('ascii');
        console.log(`  Decoded D: ${decodedD}`);
        console.log(`  Decoded E: ${decodedE}`);
        
        const fragmentDE = decodedD + decodedE;
        console.log(`  Fragment DE: ${fragmentDE}`);
        
        // Combine all fragments with glue tokens
        const finalResult = fragmentA + '-' + fragmentBC + ':' + fragmentDE;
        console.log(`\n🎯 Final combined string: ${finalResult}`);
        
        return finalResult;
        
    } catch (error) {
        console.error(`❌ Error extracting fragments: ${error.message}`);
        return null;
    }
}

// Step 3: Verify the final result format
function verifyFinalResult(result) {
    console.log('\n📋 Step 3: Verifying final result format...');
    
    if (!result) {
        console.log('❌ No result to verify');
        return false;
    }
    
    // Check if it matches the expected format
    const expectedPattern = /^IMG_PATH:\/assets\/level8_stego\.png;\s*MD5_TOKEN:[a-f0-9]+.*Url\/inspect\.png$/;
    
    if (expectedPattern.test(result)) {
        console.log('✅ Final result matches expected format');
        console.log(`   Result: ${result}`);
        return true;
    } else {
        console.log('❌ Final result does not match expected format');
        console.log(`   Expected: IMG_PATH:/assets/level8_stego.png; MD5_TOKEN:<hex>`);
        console.log(`   Got: ${result}`);
        return false;
    }
}

// Step 4: Check for security (no flags in client files)
function checkSecurity() {
    console.log('\n📋 Step 4: Security check - ensuring no flags in client files...');
    
    const clientFiles = [
        'public/dashboard.html',
        'public/style.css', 
        'public/app.js'
    ];
    
    let hasFlags = false;
    
    clientFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('flag{')) {
                console.log(`❌ ${file} contains flag{ - SECURITY VIOLATION`);
                hasFlags = true;
            } else {
                console.log(`✅ ${file} - no flags found`);
            }
        }
    });
    
    if (!hasFlags) {
        console.log('✅ All client files are clean - no flags exposed');
    }
    
    return !hasFlags;
}

// Helper function for ROT13
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode(
            (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        );
    });
}

// Main verification function
function runVerification() {
    const markersOK = checkMarkers();
    const result = extractAndDecodeFragments();
    const formatOK = verifyFinalResult(result);
    const securityOK = checkSecurity();
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 VERIFICATION SUMMARY:');
    console.log(`  Markers found: ${markersOK ? '✅' : '❌'}`);
    console.log(`  Fragments decoded: ${result ? '✅' : '❌'}`);
    console.log(`  Format correct: ${formatOK ? '✅' : '❌'}`);
    console.log(`  Security clean: ${securityOK ? '✅' : '❌'}`);
    
    if (markersOK && result && formatOK && securityOK) {
        console.log('\n🎉 ALL CHECKS PASSED - Dashboard is ready for deployment!');
        return true;
    } else {
        console.log('\n❌ SOME CHECKS FAILED - Please fix issues before deployment');
        return false;
    }
}

// Run the verification
if (require.main === module) {
    runVerification();
}

module.exports = { runVerification, extractAndDecodeFragments, checkMarkers, checkSecurity };
