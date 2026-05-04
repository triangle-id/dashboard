import Link from 'next/link';
import { Field } from '@/components/Field';
import { register } from './actions';

const ERRORS: Record<string, string> = {
  missing: 'Please fill in email, password, and company name.',
  weak: 'Password must be at least 8 characters.',
  exists: 'An account with that email already exists.',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Could not create account.' : null;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={register}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-xl font-semibold">Create account</h1>
        <Field label="Email" name="email" type="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          hint="At least 8 characters."
        />
        <Field label="Company name" name="company_name" required />
        <Field
          label="Company domain"
          name="company_domain"
          placeholder="acme.com"
        />
        {message ? (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create account
        </button>
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
