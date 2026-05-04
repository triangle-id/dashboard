# Triangle ID / Dashboard

Employer-facing web app for issuing verifiable employment credentials.

## What this does

Employers log in, fill out a form with an employee's details (company, role, dates), and issue them a signed employment credential. The credential is emailed to the employee as an SD-JWT VC, which they can later present to recruitment platforms for instant verification.

## Status

Early build phase. The scaffold is in place with auth, database, forms, and email delivery. Credential signing is mocked until the SDK is ready.

## Stack

- Next.js (App Router)
- TypeScript
- SQLite via better-sqlite3
- Tailwind CSS
- Resend (transactional email)

## Getting started

```bash
git clone https://github.com/triangle-id/dashboard.git
cd dashboard
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:3000`.

### Environment variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) for sending credential emails |
| `JWT_SECRET` | Secret for signing session tokens |

## Pages

- `/login` - Employer authentication
- `/dashboard` - List of issued credentials
- `/issue` - Form to create and send a new credential
- `/settings` - Employer profile (company name, domain)

## Database

SQLite with two tables:

- `employers` - id, email, password_hash, company_name, company_domain, created_at
- `credentials` - id, employer_id, employee_email, company, role, start_date, end_date, status, created_at
