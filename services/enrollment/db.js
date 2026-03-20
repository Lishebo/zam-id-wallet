<<<<<<< HEAD
// services/enrollment/db.js
// Connects to the PostgreSQL database

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'zam_id_wallet',
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASSWORD || 'zamwallent123',
});

// Test the connection when the service starts
=======
﻿const { Pool } = require('pg');

const pool = new Pool({
  host:     '127.0.0.1',
  port:     5432,
  database: 'zam_id_wallet',
  user:     'admin',
  password: 'zamwallent123',
});

>>>>>>> 7025459cadbd346aa8238a9341e9532aab519fac
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

<<<<<<< HEAD
module.exports = pool;
=======
module.exports = pool;
>>>>>>> 7025459cadbd346aa8238a9341e9532aab519fac
