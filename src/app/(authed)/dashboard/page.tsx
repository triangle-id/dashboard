import Link from 'next/link';
import db from '@/lib/db';
import { requireEmployer } from '@/lib/auth';

type CredentialRow = {
  id: number;
  employee_email: string;
  role: string;
  start_date: string;
  end_date: string | null;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const employer = await requireEmployer();
  const credentials = db
    .prepare(
      `SELECT id, employee_email, role, start_date, end_date, status, created_at
       FROM credentials
       WHERE employer_id = ?
       ORDER BY created_at DESC`,
    )
    .all(employer.id) as CredentialRow[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Issued credentials</h1>
        <Link
          href="/issue"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Issue new
        </Link>
      </div>

      {credentials.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          No credentials issued yet.{' '}
          <Link href="/issue" className="underline">
            Issue your first one
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {credentials.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">{c.employee_email}</td>
                  <td className="px-4 py-3">{c.role}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.start_date} — {c.end_date ?? 'present'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[c.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
