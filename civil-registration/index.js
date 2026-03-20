const express = require('express');
const cors    = require('cors');
const pool    = require('./db');
const { generateNIN } = require('./nin-generator');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Civil Registration', status: 'running', port: 3004 });
});

app.post('/birth', async (req, res) => {
  const { childFirstName, childLastName, dateOfBirth, gender, motherNin, fatherNin, hospitalName } = req.body;

  if (!childFirstName || !childLastName || !dateOfBirth || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const citizenResult = await client.query(
      `INSERT INTO citizens (first_name, last_name, date_of_birth, gender, nationality)
       VALUES ($1, $2, $3, $4, 'Zambian') RETURNING id`,
      [childFirstName, childLastName, dateOfBirth, gender]
    );
    const childId = citizenResult.rows[0].id;

    const nin = generateNIN(dateOfBirth, gender, 1);
    const regNumber = 'BR-' + Date.now();

    await client.query(
      `INSERT INTO nin_records (citizen_id, nin, status, issued_by)
       VALUES ($1, $2, 'active', 'CIVIL-REGISTRATION')`,
      [childId, nin]
    );

    await client.query(
      `INSERT INTO births (child_citizen_id, registration_number, date_of_birth, gender, mother_nin, father_nin, hospital_name, assigned_nin)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [childId, regNumber, dateOfBirth, gender, motherNin || null, fatherNin || null, hospitalName || null, nin]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success:            true,
      nin,
      childId,
      registrationNumber: regNumber,
      message:            'Birth registered — NIN auto-assigned at birth'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Birth registration failed:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.post('/death', async (req, res) => {
  const { citizenNin, dateOfDeath, placeOfDeath, causeOfDeath, icd11Code, icd11Description } = req.body;

  if (!citizenNin || !dateOfDeath || !icd11Code) {
    return res.status(400).json({ error: 'citizenNin, dateOfDeath and icd11Code are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const citizen = await client.query(
      'SELECT c.id FROM citizens c JOIN nin_records n ON n.citizen_id = c.id WHERE n.nin = $1',
      [citizenNin]
    );

    if (citizen.rows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    const citizenId = citizen.rows[0].id;
    const regNumber = 'DR-' + Date.now();

    await client.query(
      `INSERT INTO deaths (citizen_id, registration_number, date_of_death, place_of_death, cause_of_death, icd11_code, icd11_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [citizenId, regNumber, dateOfDeath, placeOfDeath || null, causeOfDeath || null, icd11Code, icd11Description || null]
    );

    await client.query(
      `UPDATE nin_records SET status = 'revoked', revoked_at = NOW(), revoked_reason = 'Citizen deceased'
       WHERE citizen_id = $1`,
      [citizenId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success:            true,
      registrationNumber: regNumber,
      message:            'Death registered — NIN revoked — ICD-11 code recorded'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Civil Registration service running on port ' + PORT);
});