// Additional cyberpunk effects and animations
document.addEventListener('DOMContentLoaded', function() {
    // Matrix rain effect
    createMatrixRain();
    
    // Glitch effects on hover
    addGlitchEffects();
    
    // Terminal cursor blinking
    addTerminalCursor();
    
    // Random system alerts
    addSystemAlerts();
});

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function addGlitchEffects() {
    const elements = document.querySelectorAll('.btn, .panel-title, .form-input');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

function addTerminalCursor() {
    const terminal = document.getElementById('terminalOutput');
    if (terminal) {
        const cursor = document.createElement('span');
        cursor.textContent = '_';
        cursor.style.animation = 'blink 1s infinite';
        cursor.style.color = '#00ff00';
        terminal.appendChild(cursor);
    }
}

function addSystemAlerts() {
    const alertMessages = [
        'WARNING: Unauthorized access attempt detected',
        'INFO: Database backup completed successfully',
        'ALERT: Security protocols updated',
        'NOTICE: System maintenance scheduled',
        'WARNING: High CPU usage detected',
        'INFO: New security patch available',
        'ALERT: Suspicious activity logged'
    ];
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            const message = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            showSystemAlert(message);
        }
    }, 15000);
}

function showSystemAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        z-index: 1000;
        border-left: 4px solid #ff0000;
        animation: slideIn 0.3s ease-out;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cyber-glow {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    }
    
    .cyber-pulse {
        animation: cyberPulse 2s infinite;
    }
    
    @keyframes cyberPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6); }
    }
`;
document.head.appendChild(style);
