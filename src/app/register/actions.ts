'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { createSession } from '@/lib/session';

export async function register(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const company_name = String(formData.get('company_name') ?? '').trim();
  const company_domain = String(formData.get('company_domain') ?? '').trim().toLowerCase();

  if (!email || !password || !company_name) redirect('/register?error=missing');
  if (password.length < 8) redirect('/register?error=weak');

  const existing = db.prepare('SELECT id FROM employers WHERE email = ?').get(email);
  if (existing) redirect('/register?error=exists');

  const password_hash = await bcrypt.hash(password, 10);
  const result = db
    .prepare(
      'INSERT INTO employers (email, password_hash, company_name, company_domain) VALUES (?, ?, ?, ?)',
    )
    .run(email, password_hash, company_name, company_domain);

  await createSession({ employerId: Number(result.lastInsertRowid) });
  redirect('/dashboard');
}
