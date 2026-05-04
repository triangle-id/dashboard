import { Field } from '@/components/Field';
import { requireEmployer } from '@/lib/auth';
import { updateSettings } from './actions';

const ERRORS: Record<string, string> = {
  missing: 'Company name is required.',
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const employer = await requireEmployer();
  const { error, ok } = await searchParams;
  const errorMessage = error ? ERRORS[error] ?? 'Could not save settings.' : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <form
        action={updateSettings}
        className="max-w-lg space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <Field label="Email" value={employer.email} disabled />
        <Field
          label="Company name"
          name="company_name"
          defaultValue={employer.company_name}
          required
        />
        <Field
          label="Company domain"
          name="company_domain"
          defaultValue={employer.company_domain}
          placeholder="acme.com"
        />
        {errorMessage ? (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
        ) : null}
        {ok ? (
          <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>
        ) : null}
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
