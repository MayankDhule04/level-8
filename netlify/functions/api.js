const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Initialize SQLite database
const db = new sqlite3.Database('./ctf.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Login endpoint (vulnerable to SQL injection)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Intentionally vulnerable SQL query
  const sql = `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log('Executing SQL:', sql);
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (rows.length > 0) {
      const user = rows[0];
      console.log('Login successful for user:', user.username);
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      console.log('Login failed for user:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Submit flag endpoint
app.post('/submit', (req, res) => {
  const { flag } = req.body;
  
  if (!flag) {
    return res.status(400).json({ error: 'Flag is required' });
  }
  
  const realFlag = process.env.FLAG_REAL || 'flag{Url/inspect.png}';
  
  if (flag === realFlag) {
    console.log('Correct flag submitted:', flag);
    res.json({
      success: true,
      message: 'Congratulations! You found the flag!'
    });
  } else {
    console.log('Incorrect flag submitted:', flag);
    res.status(400).json({
      success: false,
      message: 'Incorrect flag'
    });
  }
});

// UI log endpoint
app.post('/ui-log', (req, res) => {
  const { event, data } = req.body;
  console.log('UI Event:', event, data);
  res.json({ success: true });
});

// Hint endpoint
app.get('/hint/:level', (req, res) => {
  const level = req.params.level;
  const hints = {
    '1': 'Try SQL injection with UNION SELECT',
    '2': 'Look for hidden data in the dashboard code',
    '3': 'Check for steganography in the image',
    '4': 'Crack the MD5 hash to get the final flag'
  };
  
  const hint = hints[level] || 'No hint available for this level';
  res.json({ hint });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Netlify function handler
exports.handler = async (event, context) => {
  // Create a mock request/response for Express
  const request = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body
  };
  
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: ''
  };
  
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: response.headers,
        body: ''
      };
    }
    
    // Route the request based on the path
    if (event.path === '/api/login' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { username, password } = body;
      
      if (!username || !password) {
        return {
          statusCode: 400,
          headers: response.headers,
          body: JSON.stringify({ error: 'Username and password are required' })
        };
      }
      
      // Intentionally vulnerable SQL query
      const sql = `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;
      
      // For Netlify, we'll simulate the database response
      // In a real deployment, you'd need to set up a proper database
      const mockUsers = [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'user1', role: 'user' },
        { id: 3, username: 'test', role: 'user' },
        { id: 4, username: 'guest', role: 'guest' }
      ];
      
      // Check for SQL injection patterns
      if (username.includes("'") || username.includes('"') || username.includes('UNION') || username.includes('SELECT')) {
        // Simulate SQL injection success - return all users
        return {
          statusCode: 200,
          headers: response.headers,
          body: JSON.stringify({
            success: true,
            message: 'SQL injection detected - showing all users',
            users: mockUsers,
            secret: '/assets/inspect.png' // This is what they should find
          })
        };
      }
      
      // Normal login check
      const user = mockUsers.find(u => u.username === username && u.password === password);
      if (user) {
        return {
          statusCode: 200,
          headers: response.headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            user: { id: user.id, username: user.username, role: user.role }
          })
        };
      } else {
        return {
          statusCode: 401,
          headers: response.headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
    }
    
    if (event.path === '/api/submit' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { flag } = body;
      
      if (!flag) {
        return {
          statusCode: 400,
          headers: response.headers,
          body: JSON.stringify({ error: 'Flag is required' })
        };
      }
      
      const realFlag = process.env.FLAG_REAL || 'flag{Url/inspect.png}';
      
      if (flag === realFlag) {
        return {
          statusCode: 200,
          headers: response.headers,
          body: JSON.stringify({
            success: true,
            message: 'Congratulations! You found the flag!'
          })
        };
      } else {
        return {
          statusCode: 400,
          headers: response.headers,
          body: JSON.stringify({
            success: false,
            message: 'Incorrect flag'
          })
        };
      }
    }
    
    if (event.path === '/api/ui-log' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      console.log('UI Event:', body.event, body.data);
      return {
        statusCode: 200,
        headers: response.headers,
        body: JSON.stringify({ success: true })
      };
    }
    
    if (event.path.startsWith('/api/hint/') && event.httpMethod === 'GET') {
      const level = event.path.split('/')[3];
      const hints = {
        '1': 'Try SQL injection with UNION SELECT',
        '2': 'Look for hidden data in the dashboard code',
        '3': 'Check for steganography in the image',
        '4': 'Crack the MD5 hash to get the final flag'
      };
      
      const hint = hints[level] || 'No hint available for this level';
      return {
        statusCode: 200,
        headers: response.headers,
        body: JSON.stringify({ hint })
      };
    }
    
    if (event.path === '/api/health' && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: response.headers,
        body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() })
      };
    }
    
    // Default response for unknown routes
    return {
      statusCode: 404,
      headers: response.headers,
      body: JSON.stringify({ error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: response.headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
