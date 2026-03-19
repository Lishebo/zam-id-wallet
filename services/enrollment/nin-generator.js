// services/enrolment/nin-generator.js
// Generates a 13-digit NIN in the INRIS format: YYMMDDGSSSCAZ

function calculateLuhn(twelveDigits) {
  // The Luhn algorithm calculates the 13th checksum digit
  // It detects any single-digit typing error
  const digits = twelveDigits.split('').map(Number);
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    // Double every second digit from the right 
    if ((digits.length - i) % 2 === 0) {
      d = d * 2;
      if (d > 9) d = d - 9; // If result is 2 digits, add them together
    }
    sum += d;
  }

  // The checksum digit is whatever makes the total a multiple of 10
  const checksum = (10 - (sum % 10)) % 10;
  return checksum.toString();
}

function generateNIN(dateOfBirth, gender, sequenceNumber = 1) {
  // dateOfBirth comes in as a string: '1999-03-15'
  // gender comes in as: 'male' or 'female'
  // sequenceNumber is how many people enrolled that same day

  // Step 1 — Extract date parts
  const dob = new Date(dateOfBirth);
  const YY = String(dob.getFullYear()).slice(-2);  // Last 2 digits of year
  const MM = String(dob.getMonth() + 1).padStart(2, '0'); // Month 01-12
  const DD = String(dob.getDate()).padStart(2, '0');       // Day 01-31

  // Step 2 — Gender digit
  // Female = random digit 0-4, Male = random digit 5-9
  const G = gender === 'female'
    ? String(Math.floor(Math.random() * 5))      // 0, 1, 2, 3, or 4
    : String(Math.floor(Math.random() * 5) + 5); // 5, 6, 7, 8, or 9

  // Step 3 — Daily sequence number (3 digits, padded with zeros)
  const SSS = String(sequenceNumber).padStart(3, '0'); // 001, 002, 003...

  // Step 4 — Citizenship status
  const C = '0'; // 0 = Zambian citizen, 1 = permanent resident

  // Step 5 — Attribute placeholder
  const A = '0';

  // Step 6 — Combine first 12 digits
  const twelveDigits = `${YY}${MM}${DD}${G}${SSS}${C}${A}`;

  // Step 7 — Calculate Luhn checksum for the 13th digit
  const Z = calculateLuhn(twelveDigits);

  // Step 8 — Return the full 13-digit NIN
  return `${twelveDigits}${Z}`;
}

// Export so other files can use it
module.exports = { generateNIN };


// ── QUICK TEST ────────────────────────────────────────────
// Run this file directly to test: node nin-generator.js
if (require.main === module) {
  const nin1 = generateNIN('1999-03-15', 'male', 1);
  const nin2 = generateNIN('2001-11-22', 'female', 1);
  const nin3 = generateNIN('1985-07-04', 'male', 3);

  console.log('Test NIns:');
  console.log('Male   born 1999-03-15:', nin1, '— length:', nin1.length);
  console.log('Female born 2001-11-22:', nin2, '— length:', nin2.length);
  console.log('Male   born 1985-07-04:', nin3, '— length:', nin3.length);

  // All three should print 13 digits
}

const { generateNIN } = require('./nin-generator');

// Inside the POST /enrol route:
//const nin = generateNIN(req.body.dateOfBirth, req.body.gender, 1);
console.log('Generated NIN:', nin);
