### Team Instructions

1. Branching Strategy
To keep the `main` branch stable for the demo, no one should code directly on it.
* Feature Branches: Create a branch for every task (e.g., `feature/task1-enrolment` or `feature/ui-wallet-screens`).
* Naming Convention: Use `name/feature-description` (e.g., `lucky/identity-service`).

2. Local Environment Setup
Before coding, every team member must:
* Install Docker and Docker Desktop.
* Install the Flutter SDK (for Sunday).
* Run `git pull origin main` daily to stay updated with our infrastructure changes.

3. Handling Secrets
* NEVER commit `.env` files or hardcoded API keys.
* Use the `.env.example` template we provided to set up local credentials.
* Private keys for RSA-2048 signing will be managed through **HashiCorp Vault**; do not store them in the source code[cite: 101, 116].

4. Commit Message Standards
We want our Git history to look professional for the judges. Use these prefixes:
* `feat:` for new features (e.g., `feat: add NIN generation logic`).
* `fix:` for bug fixes.
* `docs:` for documentation updates.
* `ui:` for styling and layout changes.

5. Pull Request (PR) Process
* When a task is done, push the branch and open a Pull Request.
* At least one other team member should review the code before it is merged into `main`.

