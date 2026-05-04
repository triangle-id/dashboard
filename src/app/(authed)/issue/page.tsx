import Link from 'next/link';
import { Field } from '@/components/Field';
import { requireEmployer } from '@/lib/auth';
import { issueCredential } from './actions';

const ERRORS: Record<string, string> = {
  missing: 'Please fill in all required fields.',
  dates: 'End date cannot be before start date.',
};

export default async function IssuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const employer = await requireEmployer();
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Could not issue credential.' : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Issue a credential</h1>
      <form
        action={issueCredential}
        className="max-w-lg space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <Field
          label="Employee email"
          name="employee_email"
          type="email"
          required
          placeholder="employee@example.com"
        />
        <Field
          label="Company"
          name="company"
          defaultValue={employer.company_name}
          required
          hint="Pre-filled from your profile. Edit in Settings."
        />
        <Field label="Role / job title" name="role" required />
        <Field label="Start date" name="start_date" type="date" required />
        <Field
          label="End date"
          name="end_date"
          type="date"
          hint="Leave blank if the employee is still employed."
        />
        {message ? (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
        ) : null}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Issue credential
          </button>
          <Link href="/dashboard" className="text-sm text-gray-700 underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
