// services/enrollment/db.js
// Connects to the PostgreSQL database for ZAM-ID Wallet
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432, // Matches your docker-compose.yml
  database: 'zam_id_wallet',
  user: 'admin',
  password: 'zamwallent123',
});

// Test the connection when the service starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = pool;
