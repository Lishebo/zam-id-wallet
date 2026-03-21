// services/enrollment/index.js
const express  = require('express');
const crypto   = require('crypto');
const cors     = require('cors');
const pool     = require('./db');
const { generateNIN } = require('./nin-generator');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Enrolment', status: 'running', port: 3001 });
});

// POST /enrol — enrol a citizen and save to database
app.post('/enrol', async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender } = req.body;

  if (!firstName || !lastName || !dateOfBirth || !gender) {
    return res.status(400).json({
      error: 'Missing fields: firstName, lastName, dateOfBirth, gender'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const citizenResult = await client.query(
      `INSERT INTO citizens (first_name, last_name, date_of_birth, gender, nationality)
       VALUES ($1, $2, $3, $4, 'Zambian')
       RETURNING id`,
      [firstName, lastName, dateOfBirth, gender]
    );
    const citizenId = citizenResult.rows[0].id;

    const nin = generateNIN(dateOfBirth, gender, 1);

    await client.query(
      `INSERT INTO nin_records (citizen_id, nin, status, issued_by)
       VALUES ($1, $2, 'active', 'ZAM-ID-SYSTEM')`,
      [citizenId, nin]
    );

    const bioHash = crypto
      .createHash('sha256')
      .update(`${nin}-${dateOfBirth}-${Date.now()}`)
      .digest('hex');

    await client.query(
      `INSERT INTO biometrics (citizen_id, type, data, hash)
       VALUES ($1, 'facial', $2, $3)`,
      [citizenId, Buffer.from(bioHash), bioHash]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      nin:     nin,
      bioHash: bioHash,
      citizen: {
        id: citizenId,
        firstName,
        lastName,
        dateOfBirth,
        gender
      },
      message: 'Citizen enrolled and saved to database successfully.'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Enrolment failed:', err.message);

    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Duplicate entry — citizen or NIN already exists'
      });
    }

    res.status(500).json({ error: 'Enrolment failed: ' + err.message });

  } finally {
    client.release();
  }
});

// GET /citizen/:nin — look up a citizen by NIN
app.get('/citizen/:nin', async (req, res) => {
  const { nin } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender,
              n.nin, n.status, n.issued_at
       FROM citizens c
       JOIN nin_records n ON n.citizen_id = c.id
       WHERE n.nin = $1`,
      [nin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    res.json({ success: true, citizen: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
// GET /citizens — list all citizens with NIns
app.get('/citizens', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender,
              n.nin, n.status, n.issued_at
       FROM citizens c
       JOIN nin_records n ON n.citizen_id = c.id
       ORDER BY n.issued_at DESC
       LIMIT 100`
    );
    res.json({ success: true, citizens: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Enrolment service running on port ${PORT}`);
});