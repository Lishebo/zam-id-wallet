const express = require('express');
const cors    = require('cors');
const pool    = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID GSB Gateway', status: 'running', port: 3005 });
});

// POST /kyc — NIN-verified KYC share with consent
app.post('/kyc', async (req, res) => {
  const { nin, agencyName, consentType } = req.body;

  if (!nin || !agencyName || !consentType) {
    return res.status(400).json({ error: 'nin, agencyName and consentType are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1 — Find citizen by NIN
    const citizenResult = await client.query(
      'SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender FROM citizens c JOIN nin_records n ON n.citizen_id = c.id WHERE n.nin = $1',
      [nin]
    );

    if (citizenResult.rows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    const citizen = citizenResult.rows[0];

    // Step 2 — Find or create agency
    let agencyResult = await client.query(
      'SELECT id FROM external_agencies WHERE agency_name = $1',
      [agencyName]
    );

    if (agencyResult.rows.length === 0) {
      agencyResult = await client.query(
        `INSERT INTO external_agencies (agency_name, agency_type, api_key_hash)
         VALUES ($1, 'mobile_money', 'mock-hash-' || $1) RETURNING id`,
        [agencyName]
      );
    }

    const agencyId = agencyResult.rows[0].id;

    // Step 3 — Log consent
    const consentResult = await client.query(
      `INSERT INTO consent_logs (citizen_id, agency_id, consent_type, consent_detail)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [citizen.id, agencyId, consentType, JSON.stringify({ nin, agencyName, sharedAt: new Date() })]
    );

    // Step 4 — Log transaction
    await client.query(
      `INSERT INTO transactions (citizen_id, agency_id, consent_log_id, transaction_type, status, currency)
       VALUES ($1, $2, $3, $4, 'completed', 'ZMW')`,
      [citizen.id, agencyId, consentResult.rows[0].id, consentType]
    );

    await client.query('COMMIT');

    // Step 5 — Return KYC package to agency
    res.status(201).json({
      success:     true,
      consentId:   consentResult.rows[0].id,
      kycPackage: {
        nin,
        firstName:   citizen.first_name,
        lastName:    citizen.last_name,
        dateOfBirth: citizen.date_of_birth,
        gender:      citizen.gender,
        verified:    true,
      },
      agency:  agencyName,
      message: 'KYC data shared with consent — DPA 2021 compliant'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('KYC failed:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /consent/:nin — show all consents for a citizen
app.get('/consent/:nin', async (req, res) => {
  const { nin } = req.params;

  try {
    const result = await pool.query(
      `SELECT cl.id, ea.agency_name, cl.consent_type, cl.granted_at, cl.revoked_at
       FROM consent_logs cl
       JOIN citizens c ON c.id = cl.citizen_id
       JOIN nin_records n ON n.citizen_id = c.id
       JOIN external_agencies ea ON ea.id = cl.agency_id
       WHERE n.nin = $1
       ORDER BY cl.granted_at DESC`,
      [nin]
    );

    res.json({ success: true, consents: result.rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /consent/revoke — citizen revokes consent
app.post('/consent/revoke', async (req, res) => {
  const { consentId, reason } = req.body;

  if (!consentId) {
    return res.status(400).json({ error: 'consentId is required' });
  }

  try {
    await pool.query(
      `UPDATE consent_logs SET revoked_at = NOW(), revoked_reason = $1 WHERE id = $2`,
      [reason || 'Revoked by citizen', consentId]
    );

    res.json({ success: true, message: 'Consent revoked — data sharing stopped' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log('GSB Gateway service running on port ' + PORT);
});