# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repo is **pre-scaffold**: at time of writing, the only tracked file is `README.md`. The README describes the intended product and stack but no code, `package.json`, or framework files exist yet. Treat the README as the design spec and bootstrap accordingly when asked to start implementation — do not assume Next.js conventions are already wired up.

## Product

Employer-facing web app for issuing verifiable employment credentials. Employers authenticate, fill in employee details (company, role, dates), and issue a signed employment credential. The credential is delivered to the employee as an SD-JWT VC for later presentation to recruitment platforms.

Credential signing is expected to be **mocked** until the signing SDK is ready — keep the signing call behind a single seam so it can be swapped without touching the issue flow.

## Planned stack

- Next.js (App Router) + TypeScript
- SQLite via `better-sqlite3` (synchronous; no connection pool needed)
- Tailwind CSS
- Resend for transactional email (delivers the credential to the employee)

## Planned routes

- `/login` — employer auth
- `/dashboard` — list of issued credentials
- `/issue` — form to create + send a new credential
- `/settings` — employer profile (company name, domain)

## Planned data model

Two SQLite tables:

- `employers`: `id, email, password_hash, company_name, company_domain, created_at`
- `credentials`: `id, employer_id, employee_email, company, role, start_date, end_date, status, created_at`

`credentials.status` is the lifecycle field — issuance flow should write it (e.g. `pending` → `sent` → `delivered`/`failed`) rather than inferring state from email send results at read time.

## Environment

- `RESEND_API_KEY` — Resend API key for credential email delivery
- `JWT_SECRET` — secret for signing session tokens (auth uses JWT sessions, not a session store)

`.env.example` should be kept in sync whenever a new env var is introduced.

## Commands (once scaffolded)

The README documents the standard Next.js workflow: `npm install`, `npm run dev` (serves at `http://localhost:3000`). Build/lint/test commands do not yet exist — add them to this file once `package.json` is created.
