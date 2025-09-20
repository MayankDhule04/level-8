const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Vercel serverless compatibility
module.exports = app;

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { success: false, message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for submit attempts
const submitLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 submissions per windowMs
  message: { success: false, message: 'Too many submission attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add logging for static file requests
app.use((req, res, next) => {
  if (req.path.includes('.png') || req.path.includes('.jpg') || req.path.includes('.jpeg') || req.path.includes('.gif')) {
    console.log(`[STATIC FILE REQUEST] ${req.method} ${req.path} - IP: ${req.ip}`);
  }
  next();
});

app.use(express.static('public'));

// Performance monitoring constants
const _perfConstants = {
  animationDelay: 175,
  transitionDuration: 172,
  borderRadius: 424,
  opacityLevel: 573,
  transformScale: 400,
  boxShadow: 700,
  zIndex: 330,
  margin: 400,
  padding: 700,
  width: 900,
  height: 520
};

// Logging middleware
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  // Redact password in logs
  const logData = { ...req.body };
  if (logData.password) {
    logData.password = '[REDACTED]';
  }
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent} - Data: ${JSON.stringify(logData)}`);
  next();
};

app.use(logRequest);

// Initialize database - use in-memory for Vercel, file for local
const dbPath = process.env.VERCEL ? ':memory:' : 'ctf.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database: ${dbPath}`);
    
    // Initialize database schema for Vercel (in-memory)
    if (process.env.VERCEL) {
      // Create users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )`, (err) => {
        if (err) console.error('Error creating users table:', err);
      });
      
      // Create secrets table
      db.run(`CREATE TABLE IF NOT EXISTS secrets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating secrets table:', err);
      });
      
      // Insert sample data
      db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES 
        ('admin', 'admin123', 'admin'),
        ('user', 'password123', 'user'),
        ('guest', 'guest123', 'user')`, (err) => {
        if (err) console.error('Error inserting users:', err);
        else console.log('Users table initialized');
      });
      
      db.run(`INSERT OR IGNORE INTO secrets (title, content) VALUES 
        ('Secret Note', '/inspect.png')`, (err) => {
        if (err) console.error('Error inserting secrets:', err);
        else console.log('Secrets table initialized');
      });
    }
  }
});

// Vulnerable login endpoint - INTENTIONALLY VULNERABLE
app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({ success: false, message: 'AUTHENTICATION FAILED: Invalid request format' });
  }
  
  // Check for SQL injection patterns - be more permissive
  const inputString = `${username}${password}`;
  
  // Simplified SQL injection detection - focus on ' OR '1
  const hasSQLiPattern = inputString.includes("' OR '1") ||
                        inputString.includes("' OR 1=1") ||
                        inputString.includes("' OR 'x'='x") ||
                        /['"]\s*or\s*['"]?\d/i.test(inputString) ||
                        /['"]\s*1\s*=\s*1/i.test(inputString);
  
  console.log(`[SQL INJECTION CHECK] Input: "${inputString}", Pattern detected: ${hasSQLiPattern}`);
  
  // Always allow the request to proceed (this is a CTF challenge)
  // Comment out the blocking logic for testing
  /*
  if (!hasSQLiPattern && !inputString.toLowerCase().includes('union')) {
    const fakeErrors = [
      'AUTHENTICATION FAILED: Invalid credentials',
      'AUTHENTICATION FAILED: Access denied', 
      'AUTHENTICATION FAILED: User not found',
      'AUTHENTICATION FAILED: Security violation detected'
    ];
    const randomError = fakeErrors[Math.floor(Math.random() * fakeErrors.length)];
    return res.json({ success: false, message: randomError });
  }
  */
  
  // VULNERABLE: Direct string concatenation - DO NOT USE IN PRODUCTION
  const sql = `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log(`[VULNERABLE QUERY] ${sql}`);
  
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.json({ success: false, message: 'AUTHENTICATION FAILED: Database connection error' });
    }
    
    console.log(`[QUERY RESULT] Found ${rows.length} rows:`, rows);
    
    if (rows.length === 0) {
      // For SQL injection attempts, always succeed with admin user
      if (hasSQLiPattern) {
        console.log('[SQL INJECTION DETECTED] Bypassing authentication');
        return res.json({ 
          success: true, 
          message: 'AUTHENTICATION SUCCESSFUL',
          user: { id: 1, username: 'admin', role: 'admin' },
          redirect: '/dashboard.html'
        });
      }
      
      // Sometimes show a fake error to make debugging harder
      const fakeErrors = [
        'AUTHENTICATION FAILED: Invalid credentials',
        'AUTHENTICATION FAILED: Access denied',
        'AUTHENTICATION FAILED: User not found',
        'AUTHENTICATION FAILED: Security violation detected'
      ];
      const randomError = fakeErrors[Math.floor(Math.random() * fakeErrors.length)];
      return res.json({ success: false, message: randomError });
    }
    
    // Return user info (this is where SQLi results will appear)
    res.json({ 
      success: true, 
      message: 'AUTHENTICATION SUCCESSFUL',
      user: rows[0],
      results: rows // This will show SQLi results
    });
  });
});

// UI Log endpoint
app.post('/ui-log', (req, res) => {
  const { event, path, clientTime, teamId } = req.body;
  
  // Log UI events
  console.log(`[UI-LOG] ${new Date().toISOString()} - Event: ${event}, Path: ${path}, Team: ${teamId || 'unknown'}`);
  
  // Log specific events
  if (event === 'inspect_clicked') {
    console.log(`[INSPECT] User clicked inspect button on ${path}`);
  } else if (event === 'download_stego') {
    console.log(`[DOWNLOAD] Stego image downloaded from ${path}`);
  }
  
  res.json({ success: true, logged: true });
});

// Submit flag endpoint
app.post('/submit', submitLimiter, (req, res) => {
  const { flag, team } = req.body;
  
  if (!flag) {
    return res.json({ success: false, message: 'FLAG REJECTED: No token provided' });
  }
  
  // Get the real flag from environment or use default for testing
  const realFlag = process.env.FLAG_REAL || 'Congratulations ! You found the real flag !';
  
  if (flag === realFlag) {
    console.log(`[SUCCESS] Correct flag submitted: ${flag} by team: ${team || 'unknown'}`);
    res.json({ success: true, message: 'FLAG ACCEPTED: Access granted to secure systems.' });
  } else {
    console.log(`[FAILED] Incorrect flag submitted: ${flag} by team: ${team || 'unknown'}`);
    res.json({ success: false, message: 'FLAG REJECTED: Invalid token. Access denied.' });
  }
});

// Hint endpoint with restrictions
const hintUsage = new Map(); // Track hint usage per IP

app.get('/hint/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const ip = req.ip || req.connection.remoteAddress;
  
  // Check if user has used too many hints
  const userHints = hintUsage.get(ip) || 0;
  if (userHints >= 2) {
    return res.json({ 
      success: false, 
      message: 'HINT LIMIT EXCEEDED: Maximum 2 hints per session. Try harder.' 
    });
  }
  
  const hints = {
    1: "Database schema contains multiple tables with varying column structures.",
    2: "Files may contain hidden data. Common forensic tools can reveal embedded information.",
    3: "Hash algorithms are reversible with sufficient computational power and wordlists."
  };
  
  if (hints[level]) {
    // Increment hint usage
    hintUsage.set(ip, userHints + 1);
    
    // Add delay to make hints feel more valuable
    setTimeout(() => {
      res.json({ 
        success: true, 
        hint: hints[level],
        remaining: 2 - (userHints + 1)
      });
    }, 2000); // 2 second delay
  } else {
    res.json({ success: false, message: 'Invalid hint level' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Specific route for inspect.png to ensure it's accessible
app.get('/inspect.png', (req, res) => {
  console.log(`[INSPECT IMAGE] GET /inspect.png requested - IP: ${req.ip}`);
  res.sendFile(path.join(__dirname, 'public', 'inspect.png'), (err) => {
    if (err) {
      console.error(`[INSPECT IMAGE ERROR] Failed to serve inspect.png:`, err.message);
      res.status(404).json({ error: 'Image not found', path: '/inspect.png' });
    } else {
      console.log(`[INSPECT IMAGE SUCCESS] Served inspect.png successfully`);
    }
  });
});

// Serve image at the requested path
app.get('/dashboard.html/inspect.png', (req, res) => {
  console.log(`[INSPECT IMAGE] GET /dashboard.html/inspect.png requested - IP: ${req.ip}`);
  res.sendFile(path.join(__dirname, 'public', 'inspect.png'), (err) => {
    if (err) {
      console.error(`[INSPECT IMAGE ERROR] Failed to serve inspect.png:`, err.message);
      res.status(404).json({ error: 'Image not found', path: '/dashboard.html/inspect.png' });
    } else {
      console.log(`[INSPECT IMAGE SUCCESS] Served inspect.png at /dashboard.html/inspect.png successfully`);
    }
  });
});

// Handle other incorrect paths
app.get('/assets/inspect.png', (req, res) => {
  console.log(`[REDIRECT] User tried to access /assets/inspect.png - redirecting to /inspect.png - IP: ${req.ip}`);
  res.redirect(301, '/inspect.png');
});

// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CTF Challenge server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Real flag: ${process.env.FLAG_REAL || 'Congratulations ! You found the real flag !'}`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
