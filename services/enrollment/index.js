// services/enrollment/index.js
const express = require('express')
const crypto  = require('crypto')
const { Pool } = require('pg')
const { generateNIN } = require('./nin-generator')

const app = express()

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

// PostgreSQL connection
const pool = new Pool({
  user:     'admin',
  host:     'localhost',
  database: 'zam_id_wallet',
  password: 'zamwallent123',
  port:     5432,
})

// Health check
app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Enrolment', status: 'running', port: 3001 })
})

// GET /citizens — fetch all enrolled citizens
app.get('/citizens', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.first_name, c.last_name, c.date_of_birth, c.gender,
             n.nin, n.status, n.issued_at
      FROM citizens c
      JOIN nin_records n ON n.citizen_id = c.id
      ORDER BY n.issued_at DESC
    `)
    res.json({ success: true, citizens: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /enrol — main endpoint
app.post('/enrol', async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, phone, province } = req.body

  // Step 1 — Validate input
  if (!firstName || !lastName || !dateOfBirth || !gender) {
    return res.status(400).json({
      error: 'Missing required fields: firstName, lastName, dateOfBirth, gender'
    })
  }

  try {
    // Step 2 — Generate the 13-digit NIN
    const nin = generateNIN(dateOfBirth, gender, 1)

    // Step 3 — Generate biometric hash placeholder
    const bioHash = crypto
      .createHash('sha256')
      .update(`${nin}-${dateOfBirth}-${Date.now()}`)
      .digest('hex')

    // Step 4 — Save citizen to database
    const citizenResult = await pool.query(
      `INSERT INTO citizens 
        (first_name, last_name, date_of_birth, gender, contact_phone, current_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [firstName, lastName, dateOfBirth, gender, phone || null,
       province ? JSON.stringify({ province }) : null]
    )
    const citizenId = citizenResult.rows[0].id

    // Step 5 — Save NIN record
    await pool.query(
      `INSERT INTO nin_records (citizen_id, nin, issued_by)
       VALUES ($1, $2, $3)`,
      [citizenId, nin, 'ZAM-ID Issuer Dashboard']
    )

    // Step 6 — Return response
    res.status(201).json({
      success: true,
      nin,
      bioHash,
      citizen: { firstName, lastName, dateOfBirth, gender },
      message: 'Citizen enrolled. NIN generated and saved to database.'
    })

  } catch (err) {
    console.error('Enrolment error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Enrolment service running on port ${PORT}`)
})