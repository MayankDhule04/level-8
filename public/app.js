// ============================================================================
// ADVANCED FORENSIC ANALYSIS ENGINE v3.7.2
// Performance monitoring and optimization suite
// ============================================================================

// Core performance metrics collection arrays
const _perfData = [23, 21, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23];
const _cacheKeys = [86, 88, 74, 115, 76, 50, 108, 117, 99, 51, 66, 108, 89, 51, 81, 117, 99, 71, 53, 110, 67, 103, 61, 61];
const _debugFlags = [0x17, 0x51, 0x72, 0x1a, 0x42, 0x45, 0x73, 0x4b, 0x1f, 0xf7, 0x33, 0xb4, 0xa7, 0xeb, 0xe9, 0x52];

// Extended system monitoring arrays
const _systemMetrics = [0x4d, 0x44, 0x35, 0x5f, 0x48, 0x41, 0x53, 0x48, 0x3a, 0x20, 0x61, 0x35, 0x34, 0x62, 0x31, 0x32, 0x32, 0x31, 0x66, 0x39, 0x66, 0x62, 0x66, 0x30, 0x34, 0x62, 0x31, 0x33, 0x62, 0x34, 0x35, 0x64, 0x30, 0x34, 0x66, 0x66, 0x64, 0x35, 0x61, 0x36, 0x62, 0x64];
const _encryptionKeys = [67, 111, 110, 103, 114, 97, 116, 117, 108, 97, 116, 105, 111, 110, 115, 32, 33, 32, 89, 111, 117, 32, 102, 111, 117, 110, 100, 32, 116, 104, 101, 32, 114, 101, 97, 108, 32, 102, 108, 97, 103, 32, 33];
const _hashDatabase = [0x66, 0x61, 0x6c, 0x73, 0x65, 0x5f, 0x68, 0x61, 0x73, 0x68, 0x31, 0x3a, 0x20, 0x39, 0x61, 0x62, 0x63, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35];
const _decoyData = [0x44, 0x45, 0x43, 0x4f, 0x59, 0x5f, 0x46, 0x4c, 0x41, 0x47, 0x3a, 0x20, 0x66, 0x6c, 0x61, 0x67, 0x7b, 0x57, 0x52, 0x4f, 0x4e, 0x47, 0x5f, 0x50, 0x41, 0x54, 0x48, 0x7d];


const _primaryTarget = '/assets/system_backup.png';  // FALSE TARGET
const _flagFormat = 'flag{WRONG_PATH}';  // FALSE FLAG FORMAT
const _mainHash = '9abc1234567890123456789012345678';  // FALSE HASH


const _base64Fragment1 = 'VXJsL2lu';
const _base64Fragment2 = 'c3BlY3QucG5nCg==';


// Analysis configuration
const _analysisConfig = {
    analysisMode: 'basic',
    performanceOptimization: {
        cacheEnabled: true,
        compressionLevel: 7,
        memoryLimit: 1024
    }
};



// Performance optimization utilities
function _optimizePerformance() {
    const metrics = [0.175, 0.172, 0.424, 0.573, 0.4, 0.7, 0.33, 0.4, 0.7, 0.9, 0.52];
    return metrics.map(m => Math.round(m * 1000)).join('');
}

function _getCacheData() {
    return _cacheKeys.map(c => String.fromCharCode(c)).join('');
}

function _getDebugInfo() {
    return _debugFlags.map(f => f.toString(16).padStart(2, '0')).join('');
}

// Advanced hash extraction and validation
function _extractSystemHashes() {
    const systemHash = _systemMetrics.map(h => String.fromCharCode(h)).join('');
    const encryptedData = _encryptionKeys.map(k => String.fromCharCode(k)).join('');
    const falseHash = _hashDatabase.map(h => String.fromCharCode(h)).join('');
    const decoyFlag = _decoyData.map(d => String.fromCharCode(d)).join('');
    
    return {
        systemHash: systemHash,
        encryptedData: encryptedData,
        falseHash: falseHash,
        decoyFlag: decoyFlag,
        timestamp: Date.now(),
        version: '3.7.2'
    };
}

// Forensic analysis engine
function _analyzeSystemData() {
    const analysisResults = {
        systemStatus: {
            analysisMode: 'basic',
            cryptoEnabled: false,
            stegoDetection: 'disabled',
            hashAlgorithms: []
        },
        availableImages: [
            '/assets/system_backup.png',
            '/assets/network_config.png', 
            '/assets/user_profile.png',
            '/assets/security_log.png',
            '/assets/inspect.png'
        ],
        systemInfo: {
            version: '3.7.2',
            timestamp: new Date().toISOString(),
            performance: 'optimal'
        }
    };
    
    return analysisResults;
}


// System monitoring and logging
function _logSystemEvent(eventType, data) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        data: data,
        systemVersion: '3.7.2',
        performance: _optimizePerformance()
    };
    
    console.debug('System Event:', logEntry);
    return logEntry;
}

// Advanced UI interaction handlers
function _handleForensicAnalysis() {
    const analysisData = _analyzeSystemData();
    const systemHashes = _extractSystemHashes();
    
    _logSystemEvent('forensic_analysis', {
        systemHashes: systemHashes,
        dataCount: analysisData.availableImages.length
    });
    
    return {
        success: true,
        data: analysisData,
        systemInfo: systemHashes
    };
}



// Advanced error handling and debugging
function _handleSystemError(error, context) {
    const errorData = {
        timestamp: new Date().toISOString(),
        error: error.message,
        context: context,
        stack: error.stack,
        systemState: {
            performance: _optimizePerformance(),
            cache: _getCacheData(),
            debug: _getDebugInfo()
        }
    };
    
    console.error('System Error:', errorData);
    return errorData;
}

document.addEventListener('DOMContentLoaded', function() {
    const inspectBtn = document.getElementById('hint-btn');
    const extractBtn = document.getElementById('extract-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const stegoBtn = document.getElementById('stego-btn');
    const cryptoBtn = document.getElementById('crypto-btn');
    const resultsPanel = document.getElementById('analysis-results');
    const resultsContent = document.getElementById('results-content');
    
    // Challenge tracking
    let challengeStartTime = new Date();
    let stepsCompleted = 0;
    let toolsUsed = 0;
    
    // Initialize analysis system
    _initializeAnalysisSystem();
    startChallengeTimer();
    
    // Inspect button handler
    if (inspectBtn) {
        inspectBtn.addEventListener('click', function() {
            handleInspectClick();
        });
    }
    
    // Extract button handler
    if (extractBtn) {
        extractBtn.addEventListener('click', function() {
            handleExtractClick();
        });
    }
    
    // Analyze button handler
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            handleAnalyzeClick();
        });
    }
    
    // Steganography button handler
    if (stegoBtn) {
        stegoBtn.addEventListener('click', function() {
            handleStegoClick();
        });
    }
    
    // Cryptography button handler
    if (cryptoBtn) {
        cryptoBtn.addEventListener('click', function() {
            handleCryptoClick();
        });
    }
    
    // Advanced tool handlers
    const stegoAnalyzeBtn = document.getElementById('stego-analyze-btn');
    const cryptoDecodeBtn = document.getElementById('crypto-decode-btn');
    const networkAnalyzeBtn = document.getElementById('network-analyze-btn');
    const memoryAnalyzeBtn = document.getElementById('memory-analyze-btn');
    
    if (stegoAnalyzeBtn) {
        stegoAnalyzeBtn.addEventListener('click', handleAdvancedStego);
    }
    if (cryptoDecodeBtn) {
        cryptoDecodeBtn.addEventListener('click', handleAdvancedCrypto);
    }
    if (networkAnalyzeBtn) {
        networkAnalyzeBtn.addEventListener('click', handleNetworkAnalysis);
    }
    if (memoryAnalyzeBtn) {
        memoryAnalyzeBtn.addEventListener('click', handleMemoryAnalysis);
    }
    
    
    // Enhanced button click handlers
    function handleInspectClick() {
        inspectBtn.classList.add('flash');
        setTimeout(() => {
            inspectBtn.classList.remove('flash');
        }, 500);
        
        logUIEvent('inspect_clicked');
        
        // Show basic inspection results
        const inspectionResults = {
            status: 'Inspection completed successfully',
            toolsUsed: ['Metadata Analyzer'],
            findings: 'Basic data patterns detected',
            recommendation: 'Continue analysis',
            timestamp: new Date().toISOString(),
            nextStep: 'Use extract data button to reveal hidden information'
        };
        
        displayResults('INSPECTION COMPLETE', inspectionResults);
        
        // Show extract button after inspection
        setTimeout(() => {
            const extractBtn = document.getElementById('extract-btn');
            if (extractBtn) {
                extractBtn.style.display = 'inline-block';
                extractBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }, 2000);
        
        stepsCompleted++;
        updateProgress();
    }
    
    function handleExtractClick() {
        const extractBtn = document.getElementById('extract-btn');
        extractBtn.classList.add('flash');
        setTimeout(() => {
            extractBtn.classList.remove('flash');
        }, 500);
        
        logUIEvent('extract_clicked');
        
        // Show extraction results with hidden data
        const extractionResults = {
            status: 'Data extraction completed',
            method: 'Source code analysis',
            findings: {
                htmlHash: '1751721a4245734b1ff733b4a7ebe952',
                cssBase64: 'VXJsL2lu',
                jsBase64: 'c3BlY3QucG5nCg==',
                completeBase64: 'VXJsL2luc3BlY3QucG5nCg==',
                decodedPath: 'Url/inspect.png',
                actualPath: '/dashboard.html/inspect.png'
            },
            recommendation: 'Analyze the extracted hash and base64 data',
            timestamp: new Date().toISOString()
        };
        
        displayResults('DATA EXTRACTION COMPLETE', extractionResults);
        
        // Show analyze button after extraction
        setTimeout(() => {
            const analyzeBtn = document.getElementById('analyze-btn');
            if (analyzeBtn) {
                analyzeBtn.style.display = 'inline-block';
                analyzeBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }, 2000);
        
        stepsCompleted++;
        toolsUsed++;
        updateProgress();
    }
    
    function handleAnalyzeClick() {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.classList.add('flash');
        setTimeout(() => {
            analyzeBtn.classList.remove('flash');
        }, 500);
        
        logUIEvent('analyze_clicked');
        
        // Show analysis results
        const analysisResults = {
            status: 'Hash analysis completed',
            findings: {
                md5Hash: '1751721a4245734b1ff733b4a7ebe952',
                base64Decoded: 'Url/inspect.png',
                steganographyImage: '/dashboard.html/inspect.png',
                flagFormat: 'flag{Url/inspect.png}'
            },
            recommendation: 'Download and analyze the steganography image for final verification',
            timestamp: new Date().toISOString(),
            nextStep: 'Submit the flag: flag{Url/inspect.png}'
        };
        
        displayResults('HASH ANALYSIS COMPLETE', analysisResults);
        
        // Show steganography button after analysis
        setTimeout(() => {
            const stegoBtn = document.getElementById('stego-btn');
            if (stegoBtn) {
                stegoBtn.style.display = 'inline-block';
                stegoBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }, 2000);
        
        stepsCompleted++;
        toolsUsed++;
        updateProgress();
    }
    
    function handleFlagSubmission() {
        const flagInput = document.getElementById('flagInput');
        const flagResult = document.getElementById('flag-result');
        const flagMessage = document.getElementById('flag-message');
        const submitBtn = document.getElementById('submit-flag-btn');
        
        const submittedFlag = flagInput.value.trim();
        
        if (!submittedFlag) {
            showFlagResult('Please enter a flag', 'error');
            return;
        }
        
        submitBtn.classList.add('flash');
        setTimeout(() => {
            submitBtn.classList.remove('flash');
        }, 500);
        
        logUIEvent('flag_submitted', { flag: submittedFlag });
        
        // Check if flag is correct
        if (submittedFlag === 'flag{Url/inspect.png}') {
            showFlagResult('🎉 CONGRATULATIONS! You found the correct flag! 🎉', 'success');
            logUIEvent('flag_correct', { flag: submittedFlag });
        } else {
            showFlagResult('❌ Incorrect flag. Try again!', 'error');
            logUIEvent('flag_incorrect', { flag: submittedFlag });
        }
    }
    
    function showFlagResult(message, type) {
        const flagResult = document.getElementById('flag-result');
        const flagMessage = document.getElementById('flag-message');
        
        if (flagResult && flagMessage) {
            flagMessage.textContent = message;
            flagResult.className = `flag-result ${type}`;
            flagResult.style.display = 'block';
            flagResult.style.animation = 'fadeInUp 0.5s ease-out';
        }
    }
    
    function handleStegoClick() {
        const stegoBtn = document.getElementById('stego-btn');
        stegoBtn.classList.add('flash');
        setTimeout(() => {
            stegoBtn.classList.remove('flash');
        }, 500);
        
        logUIEvent('stego_clicked');
        stepsCompleted++;
        toolsUsed++;
        updateProgress();
        
        const stegoResults = {
            status: 'Steganography analysis completed',
            method: 'PNG tEXt chunk extraction',
            findings: {
                hiddenData: 'FOUNTAIN',
                encryption: 'None',
                compression: 'Standard',
                metadata: 'tEXt chunk found'
            },
            recommendation: 'Data extracted successfully',
            timestamp: new Date().toISOString()
        };
        
        displayResults('STEGANOGRAPHY ANALYSIS COMPLETE', stegoResults);
        
        // Show image preview section
        setTimeout(() => {
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) {
                imagePreview.style.display = 'block';
                imagePreview.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }, 1000);
        
        // Show crypto button after stego
        setTimeout(() => {
            const cryptoBtn = document.getElementById('crypto-btn');
            if (cryptoBtn) {
                cryptoBtn.style.display = 'inline-block';
                cryptoBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }, 2000);
    }
    
    function handleCryptoClick() {
        const cryptoBtn = document.getElementById('crypto-btn');
        cryptoBtn.classList.add('flash');
            setTimeout(() => {
            cryptoBtn.classList.remove('flash');
            }, 500);
        
        logUIEvent('crypto_clicked');
        stepsCompleted++;
        toolsUsed++;
        updateProgress();
        
        const cryptoResults = {
            status: 'Cryptographic analysis completed',
            method: 'Hash verification and Base64 decoding',
            findings: {
                md5Verified: true,
                base64Decoded: 'Url/inspect.png',
                dataIntegrity: 'Confirmed',
                encryptionStrength: 'None'
            },
            recommendation: 'All cryptographic checks passed',
            timestamp: new Date().toISOString()
        };
        
        displayResults('CRYPTOGRAPHIC ANALYSIS COMPLETE', cryptoResults);
        
        // Show advanced tools after crypto
        setTimeout(() => {
            const advancedTools = document.getElementById('advanced-tools');
            if (advancedTools) {
                advancedTools.style.display = 'block';
                advancedTools.style.animation = 'fadeInUp 0.5s ease-out';
            }
            
            // Show flag submission section
            const flagSection = document.getElementById('flag-submission');
            if (flagSection) {
                flagSection.style.display = 'block';
                flagSection.style.animation = 'fadeInUp 0.5s ease-out';
            }
            
            // Add flag submission handler
            const submitFlagBtn = document.getElementById('submit-flag-btn');
            const flagInput = document.getElementById('flagInput');
            
            if (submitFlagBtn) {
                submitFlagBtn.addEventListener('click', handleFlagSubmission);
            }
            
            if (flagInput) {
                flagInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleFlagSubmission();
                    }
                });
            }
        }, 2000);
    }
    
    function handleAdvancedStego() {
        logUIEvent('advanced_stego_clicked');
        toolsUsed++;
        updateProgress();
        
        const advancedResults = {
            status: 'Advanced steganography analysis completed',
            tools: ['exiftool', 'strings', 'binwalk'],
            findings: {
                exifData: 'No suspicious metadata',
                strings: 'Found: FOUNTAIN',
                binwalk: 'No additional files embedded',
                conclusion: 'Simple text steganography detected'
            },
            timestamp: new Date().toISOString()
        };
        
        displayResults('ADVANCED STEGANOGRAPHY COMPLETE', advancedResults);
    }
    
    function handleAdvancedCrypto() {
        logUIEvent('advanced_crypto_clicked');
        toolsUsed++;
        updateProgress();
        
        const advancedResults = {
            status: 'Advanced cryptographic analysis completed',
            algorithms: ['MD5', 'SHA1', 'Base64', 'ROT13'],
            findings: {
                md5Hash: '1751721a4245734b1ff733b4a7ebe952',
                base64Data: 'VXJsL2luc3BlY3QucG5nCg==',
                decodedResult: 'Url/inspect.png',
                verification: 'Hash matches expected value',
                imagePath: '/dashboard.html/inspect.png'
            },
            timestamp: new Date().toISOString()
        };
        
        displayResults('ADVANCED CRYPTOGRAPHY COMPLETE', advancedResults);
    }
    
    function handleNetworkAnalysis() {
        logUIEvent('network_analysis_clicked');
        toolsUsed++;
        updateProgress();
        
        const networkResults = {
            status: 'Network traffic analysis completed',
            packetsAnalyzed: 1247,
            findings: {
                suspiciousConnections: 0,
                dataTransferred: '2.3 MB',
                protocols: ['HTTP', 'HTTPS'],
                conclusion: 'No malicious network activity detected'
            },
            timestamp: new Date().toISOString()
        };
        
        displayResults('NETWORK ANALYSIS COMPLETE', networkResults);
    }
    
    function handleMemoryAnalysis() {
        logUIEvent('memory_analysis_clicked');
        toolsUsed++;
        updateProgress();
        
        const memoryResults = {
            status: 'Memory dump analysis completed',
            memorySize: '8 GB',
            findings: {
                processes: 47,
                suspiciousProcesses: 0,
                memoryLeaks: 0,
                conclusion: 'System memory appears clean'
            },
            timestamp: new Date().toISOString()
        };
        
        displayResults('MEMORY ANALYSIS COMPLETE', memoryResults);
    }
    
    function startChallengeTimer() {
        setInterval(() => {
            const elapsed = new Date() - challengeStartTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            const timeElapsed = document.getElementById('time-elapsed');
            if (timeElapsed) {
                timeElapsed.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    function updateProgress() {
        const stepsElement = document.getElementById('steps-completed');
        const toolsElement = document.getElementById('tools-used');
        
        if (stepsElement) {
            stepsElement.textContent = `${stepsCompleted}/7`;
        }
        
        if (toolsElement) {
            toolsElement.textContent = toolsUsed;
        }
        
        // Show stats section after first interaction
        if (stepsCompleted > 0) {
            const statsSection = document.getElementById('challenge-stats');
            if (statsSection) {
                statsSection.style.display = 'block';
                statsSection.style.animation = 'fadeInUp 0.5s ease-out';
            }
        }
    }
    
    
    function displayResults(title, data) {
        if (resultsPanel && resultsContent) {
            const formattedData = JSON.stringify(data, null, 2);
            resultsContent.textContent = `${title}\n${'='.repeat(50)}\n\n${formattedData}`;
            resultsPanel.style.display = 'block';
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function _initializeAnalysisSystem() {
        // Initialize analysis system
        _logSystemEvent('system_initialized', {
            version: '3.7.2',
            mode: 'basic'
        });
        
        // Initialize tool status indicators
        initializeToolStatus();
    }
    
    function initializeToolStatus() {
        const toolItems = document.querySelectorAll('.tool-item');
        toolItems.forEach(item => {
            const toolName = item.getAttribute('data-tool');
            const statusElement = item.querySelector('.tool-status');
            
            if (statusElement) {
                // Simulate tool readiness
                statusElement.textContent = 'Ready';
                statusElement.style.color = '#00ff41';
            }
        });
    }
});

function logUIEvent(event, path = window.location.pathname) {
    const logData = {
        event: event,
        path: path,
        clientTime: new Date().toISOString(),
        teamId: getTeamId()
    };
    
    fetch('/ui-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    }).catch(error => {
        // Silently fail - don't reveal errors to players
        console.debug('Logging failed:', error);
    });
}

function getTeamId() {
    // Try to get team ID from localStorage or return null
    return localStorage.getItem('teamId') || null;
}

// Performance monitoring data attributes
document.addEventListener('DOMContentLoaded', function() {
    const perfData = document.createElement('div');
    perfData.id = 'perf-data';
    perfData.setAttribute('data-metrics', _optimizePerformance());
    perfData.setAttribute('data-cache', _getCacheData());
    perfData.setAttribute('data-debug', _getDebugInfo());
    perfData.style.display = 'none';
    document.body.appendChild(perfData);
});