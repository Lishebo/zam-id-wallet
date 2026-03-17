# ZAM-ID Wallet
### Bridging INRIS Today to DZAP Tomorrow

ZAM-ID Wallet is a unified digital identity platform built for the Kwame Nkrumah University - ZAMREN Student Hackathon 2026**. We have designed this platform to implement the internationally recognized W3C Trust Triangle—comprising the Issuer, Holder, and Verifier—to address all three Zambia Digital ID thematic tasks. 

Our goal is to build the most executable, Zambia-realistic MVP that aligns with the Smart Zambia Institute (SZI) and the $100M World Bank DZAP programme.



 🛠 Tech Stack
* Frontend: React.js (Issuer Dashboard)
* Mobile: Flutter (Citizen Android Wallet)
* Backend: Node.js (Microservices)
* Database: PostgreSQL (Shared Identity & Civil Registry)
* Messaging: RabbitMQ (Async Event-Driven Communication)
* Security: HashiCorp Vault, RSA-2048, and AES-256
* DevOps: Docker & GitHub Actions CI/CD

---

🏗 System Architecture: The Trust Triangle
We have structured the platform around three core roles to enable offline-first verification:

| Role | Actor | Responsibility |
| :--- | :--- | :--- |
| Issuer | Govt Registration Authority | Generates 13-digit NINs and signs credentials with RSA-2048. |
| Holder | Citizen (Android Wallet) | Stores encrypted credentials (AES-256) and controls data sharing. |
| Verifier | Banks, Hospitals, ZRA | Offline verification of signatures using the Issuer's public key. |

---

## 📋 Hackathon Tasks Overview
* Task 1: Digital National ID Generation: NIN generation, biometric capture, and an offline-capable Flutter wallet.
* Task 2: Birth Recording: Real-time NIN linkage at birth, digital PDF certificates, and ICD-11 coding.
* Task 3: GSB Integration Layer: Identity-verified KYC for MTN MoMo, Airtel Money, Zamtel, ZRA, and ECZ.

---

## 👥 The Team
We are a team of four developers from Kwame Nkrumah University:
1. Kumoyo Lishebo: System Architect & Coordinator
2. Lucky Lumbwe: Backend & API Designer
3. Sunday Mulambya: Frontend & UX Designer
4. Elijah Mwananduba: Security, DevOps & Docs