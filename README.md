Secure International Payments Portal
Project Overview
This project is a Secure International Payments Portal for an international bank, designed to handle customer payments and facilitate employee transaction verification. It includes two main components:

Customer Portal – Allows customers to register, log in, and securely initiate international transactions using SWIFT.
Employee Portal – Enables bank employees to verify transactions and submit them to SWIFT for processing.
Security is a top priority, with strong measures implemented to protect sensitive data against cyber threats.

Key Features
🛡 Security Measures
✔ Password Security – Hashing and salting techniques applied.
✔ Input Validation – Strict RegEx patterns to prevent injection attacks.
✔ Data Encryption – All traffic served over SSL/TLS for secure transmission.
✔ Attack Prevention – Protection against:

Session Hijacking
Clickjacking
SQL Injection
Cross-Site Scripting (XSS)
Man-in-the-Middle (MITM) Attacks
DDoS Attacks
💳 Customer Portal
Secure Registration & Login (Full Name, ID, Account Number, Password).
Transaction Processing – Enter amount, select currency, and provide SWIFT details.
Real-time Transaction Storage in a secure database.
🏦 Employee Portal
Pre-registered login for employees (no self-registration).
Transaction Verification – Review payee details and approve payments.
Submit to SWIFT for final processing.
🛠 Technical Stack
Frontend: React / Angular
Backend: Node.js / Express / Django / Flask (as per implementation)
Database: PostgreSQL / MySQL (secured)
Security Tools:
SonarQube – Code quality and security checks
MobSF – Mobile security analysis
ScoutSuite – Cloud security assessment
CircleCI – CI/CD Pipeline integration
