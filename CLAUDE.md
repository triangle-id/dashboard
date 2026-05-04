# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Employer-facing web app for issuing verifiable employment credentials. Employers sign in, submit employee details, and a credential record is created with `status = 'pending'`. The signing + email-delivery side is **deliberately not built yet** — keep the issue flow database-only until the SD-JWT signing SDK and Resend integration are added.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config; no `tailwind.config.*` file — see `src/app/globals.css`)
- SQLite via `better-sqlite3` (synchronous; `data.db` in repo root, gitignored)
- `jose` for JWT (edge-compatible — required for middleware)
- `bcryptjs` for password hashing (pure JS; swap to native `bcrypt` if a perf/security need appears — API is identical)

## Commands

```bash
npm install
cp .env.example .env       # then set JWT_SECRET to a long random string
npm run dev                # http://localhost:3000
npm run build && npm run start
npm run lint
```

There is no test runner configured yet.

## Architecture

**Server Components + Server Actions only.** No `app/api/*` routes. Forms post directly to server actions colocated in `actions.ts` next to the page that uses them. Validation in actions; errors surfaced via `?error=...` query params, mapped to messages at the page level.

**Auth boundary is enforced in two places**:
1. `src/middleware.ts` — edge runtime, JWT-verifies the `session` cookie via `jose`. Redirects unauthed → `/login` for protected routes; redirects authed users away from `/login` and `/register`. Cannot import `db.ts` (edge runtime — no native modules).
2. `src/lib/auth.ts` — `requireEmployer()` is the in-page gate. It re-checks the session AND looks up the employer row, redirecting to `/login` if either fails. Wrapped in React's `cache()` so layout + page in the same request share one DB lookup. **Always call this in protected pages/actions** rather than reading `getSession()` directly — it gives you the typed employer record.

The `(authed)` route group exists so the nav + auth check live in one shared layout. Add new authed routes inside it.

**Sessions**: signed JWT in an `httpOnly` cookie named `session`, 7-day expiry, HS256 with `JWT_SECRET`. Created via `createSession({ employerId })` in `src/lib/session.ts`. No server-side session store.

**Database**: `src/lib/db.ts` opens the SQLite file at module load and runs `CREATE TABLE IF NOT EXISTS` for both tables. WAL mode + foreign keys on. The default export is the live `Database` instance — import and call `.prepare(...).run/get/all` directly. Don't introduce an ORM or query builder for this MVP. `better-sqlite3` is in `serverExternalPackages` (`next.config.mjs`) so Next doesn't try to bundle the native module.

**Schema** (see `src/lib/db.ts` for the source of truth):
- `employers(id, email UNIQUE, password_hash, company_name, company_domain, created_at)`
- `credentials(id, employer_id FK, employee_email, company, role, start_date, end_date NULL, status, created_at)`

`credentials.status` is the issuance lifecycle field. Today only `'pending'` is written. When signing/email lands, transition `pending → sent → delivered/failed` by writing `status` from the worker, not by inferring from external state at read time.

**Registration**: `/register` was added so the app is usable end-to-end. The original spec only listed `/login`; if Triangle ID later moves to invite-only employer onboarding, this page is the thing to remove or gate.

## Conventions

- Form fields use the `<Field>` component in `src/components/Field.tsx`. Reach for it before hand-rolling inputs.
- Server actions: trim + lowercase emails/domains before they touch the DB. Validate at the boundary (the action), not in the page.
- Use `redirect()` from `next/navigation` for both success and error paths in actions — never wrap action bodies in `try/catch` around it (it throws a sentinel that Next intercepts).
- `cookies()`, `headers()`, `params`, and `searchParams` are **async** in Next 15 — always `await` them.

## Environment

- `JWT_SECRET` — required. Session signing key. App throws on first request if unset.
- `RESEND_API_KEY` — placeholder for when email delivery is wired up; not consumed yet.
- `DATABASE_PATH` — optional override for the SQLite file location.
