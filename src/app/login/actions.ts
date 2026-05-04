'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { createSession, destroySession } from '@/lib/session';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) redirect('/login?error=missing');

  const row = db
    .prepare('SELECT id, password_hash FROM employers WHERE email = ?')
    .get(email) as { id: number; password_hash: string } | undefined;

  if (!row) redirect('/login?error=invalid');
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) redirect('/login?error=invalid');

  await createSession({ employerId: row.id });
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}
