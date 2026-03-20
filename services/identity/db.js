const express = require('express');
const cors    = require('cors');
const pool    = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Verification', status: 'running', port: 3003 });
});

app.post('/verify', async (req, res) => {
  const { nin } = req.body;
  if (!nin) return res.status(400).json({ error: 'NIN is required' });

  try {
    const result = await pool.query(
      'SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender, n.nin, n.status, n.issued_at FROM citizens c JOIN nin_records n ON n.citizen_id = c.id WHERE n.nin = $1',
      [nin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ verified: false, error: 'NIN not found' });
    }

    const citizen = result.rows[0];

    if (citizen.status !== 'active') {
      return res.status(403).json({ verified: false, error: 'Credential is ' + citizen.status });
    }

    res.json({
      verified: true,
      nin:      citizen.nin,
      citizen: {
        id:          citizen.id,
        firstName:   citizen.first_name,
        lastName:    citizen.last_name,
        dateOfBirth: citizen.date_of_birth,
        gender:      citizen.gender,
      },
      issuedAt: citizen.issued_at,
      message:  'Identity verified — Trust Triangle complete'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/verify/:nin', async (req, res) => {
  const { nin } = req.params;

  try {
    const result = await pool.query(
      'SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender, n.nin, n.status, n.issued_at FROM citizens c JOIN nin_records n ON n.citizen_id = c.id WHERE n.nin = $1',
      [nin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ verified: false, error: 'NIN not found' });
    }

    const citizen = result.rows[0];

    res.json({
      verified: true,
      nin:      citizen.nin,
      citizen: {
        firstName:   citizen.first_name,
        lastName:    citizen.last_name,
        dateOfBirth: citizen.date_of_birth,
        gender:      citizen.gender,
      },
      message: 'Identity verified — Trust Triangle complete'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Verification service running on port ' + PORT);
});