// services/enrollment/index.js
// POST /enrol — receives citizen details, generates NIN, returns it

const express = require('express');
const crypto  = require('crypto');
const { generateNIN } = require('./nin-generator');

const app  = express();
app.use(express.json());

// Health check — visiting localhost:3001 shows this
app.get('/', (req, res) => {
  res.json({ service: 'ZAM-ID Enrolment', status: 'running', port: 3001 });
});

// POST /enrol — main endpoint
app.post('/enrol', (req, res) => {
  const { firstName, lastName, dateOfBirth, gender } = req.body;

  // Step 1 — Validate input
  if (!firstName || !lastName || !dateOfBirth || !gender) {
    return res.status(400).json({
      error: 'Missing required fields: firstName, lastName, dateOfBirth, gender'
    });
  }

  // Step 2 — Generate the 13-digit NIN
  const nin = generateNIN(dateOfBirth, gender, 1);

  // Step 3 — Generate a biometric hash placeholder
  // In production this would be the SHA-256 of the actual biometric template
  const bioHash = crypto
    .createHash('sha256')
    .update(`${nin}-${dateOfBirth}-${Date.now()}`)
    .digest('hex');

  // Step 4 — Return the NIN and hash
  // The identity service will use this to sign the JWT credential
  res.status(201).json({
    success:   true,
    nin:       nin,
    bioHash:   bioHash,
    citizen: {
      firstName,
      lastName,
      dateOfBirth,
      gender
    },
    message: 'Citizen enrolled. NIN generated. Ready for credential signing.'
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Enrolment service running on port ${PORT}`);
});
