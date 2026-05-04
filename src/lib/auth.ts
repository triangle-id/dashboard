import { cache } from 'react';
import { redirect } from 'next/navigation';
import db from './db';
import { getSession } from './session';

export type Employer = {
  id: number;
  email: string;
  company_name: string;
  company_domain: string;
};

export const requireEmployer = cache(async (): Promise<Employer> => {
  const session = await getSession();
  if (!session) redirect('/login');

  const row = db
    .prepare('SELECT id, email, company_name, company_domain FROM employers WHERE id = ?')
    .get(session.employerId) as Employer | undefined;

  if (!row) redirect('/login');
  return row;
});
