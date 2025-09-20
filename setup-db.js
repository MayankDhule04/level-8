const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create database and tables
const db = new sqlite3.Database('ctf.db', (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `;
    
    const secretsTable = `
      CREATE TABLE IF NOT EXISTS secrets (
        id INTEGER PRIMARY KEY,
        note TEXT,
        owner TEXT
      )
    `;
    
    db.run(usersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('Users table created');
      
      db.run(secretsTable, (err) => {
        if (err) {
          console.error('Error creating secrets table:', err.message);
          reject(err);
          return;
        }
        console.log('Secrets table created');
        resolve();
      });
    });
  });
};

// Seed data
const seedData = () => {
  return new Promise((resolve, reject) => {
    // Clear existing data
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error('Error clearing users:', err.message);
        reject(err);
        return;
      }
      
      db.run('DELETE FROM secrets', (err) => {
        if (err) {
          console.error('Error clearing secrets:', err.message);
          reject(err);
          return;
        }
        
        // Insert users
        const users = [
          ['admin', 'admin123', 'admin'],
          ['user1', 'password1', 'user'],
          ['test', 'test123', 'user'],
          ['guest', 'guest', 'guest']
        ];
        
        const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
        
        users.forEach(([username, password, role]) => {
          insertUser.run(username, password, role, (err) => {
            if (err) {
              console.error(`Error inserting user ${username}:`, err.message);
            } else {
              console.log(`Inserted user: ${username}`);
            }
          });
        });
        
        insertUser.finalize();
        
        // Insert secret - this is what the SQLi should reveal
        const insertSecret = db.prepare('INSERT INTO secrets (note, owner) VALUES (?, ?)');
        insertSecret.run('/assets/inspect.png', 'admin', (err) => {
          if (err) {
            console.error('Error inserting secret:', err.message);
            reject(err);
            return;
          }
          console.log('Inserted secret: /assets/inspect.png');
          insertSecret.finalize();
          resolve();
        });
      });
    });
  });
};

// Main setup function
const setup = async () => {
  try {
    console.log('Setting up CTF database...');
    
    await createTables();
    await seedData();
    
    console.log('\nDatabase setup complete!');
    console.log('Users created: admin, user1, test, guest');
    console.log('Secret created: /assets/inspect.png');
    console.log('\nYou can now start the server with: npm start');
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
};

setup();
