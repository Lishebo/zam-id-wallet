const { Pool } = require('pg');

const pool = new Pool({
  host:     '127.0.0.1',
  port:     5433,
  database: 'zam_id_wallet',
  user:     'admin',
  password: 'zamwallent123',
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = pool;
