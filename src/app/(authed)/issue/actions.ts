'use server';

import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { requireEmployer } from '@/lib/auth';

export async function issueCredential(formData: FormData) {
  const employer = await requireEmployer();

  const employee_email = String(formData.get('employee_email') ?? '').trim().toLowerCase();
  const company = String(formData.get('company') ?? '').trim();
  const role = String(formData.get('role') ?? '').trim();
  const start_date = String(formData.get('start_date') ?? '').trim();
  const end_date_raw = String(formData.get('end_date') ?? '').trim();
  const end_date = end_date_raw === '' ? null : end_date_raw;

  if (!employee_email || !company || !role || !start_date) {
    redirect('/issue?error=missing');
  }
  if (end_date && end_date < start_date) {
    redirect('/issue?error=dates');
  }

  db.prepare(
    `INSERT INTO credentials
       (employer_id, employee_email, company, role, start_date, end_date, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
  ).run(employer.id, employee_email, company, role, start_date, end_date);

  redirect('/dashboard');
}
