'use server';

import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { requireEmployer } from '@/lib/auth';

export async function updateSettings(formData: FormData) {
  const employer = await requireEmployer();

  const company_name = String(formData.get('company_name') ?? '').trim();
  const company_domain = String(formData.get('company_domain') ?? '').trim().toLowerCase();

  if (!company_name) redirect('/settings?error=missing');

  db.prepare('UPDATE employers SET company_name = ?, company_domain = ? WHERE id = ?').run(
    company_name,
    company_domain,
    employer.id,
  );

  redirect('/settings?ok=1');
}
