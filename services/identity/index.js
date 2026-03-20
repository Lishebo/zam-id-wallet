const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const pool    = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'zamid-secret-key-2026';

app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Identity', status: 'running', port: 3002 });
});

app.post('/issue', async (req, res) => {
  const { citizenId, nin, firstName, lastName, dateOfBirth, gender } = req.body;

  if (!citizenId || !nin) {
    return res.status(400).json({ error: 'citizenId and nin are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const payload = {
      nin,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      issuer:   'did:zamid:govt-authority',
      issuedAt: new Date().toISOString(),
    };

    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const result = await client.query(
      `INSERT INTO credentials (citizen_id, nin, jwt_token, expires_at, issuer, audience)
       VALUES ($1, $2, $3, $4, 'did:zamid:govt-authority', 'zamid-verifiers')
       RETURNING id`,
      [citizenId, nin, jwtToken, expiresAt]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success:      true,
      credentialId: result.rows[0].id,
      jwtToken,
      nin,
      expiresAt,
      message: 'Credential signed and saved — Issuer role complete'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Credential already exists for this citizen' });
    }
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.post('/verify-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token is required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, payload: decoded, message: 'Token valid — Trust Triangle verified' });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Identity service running on port ' + PORT);
});