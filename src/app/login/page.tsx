import Link from 'next/link';
import { Field } from '@/components/Field';
import { login } from './actions';

const ERRORS: Record<string, string> = {
  missing: 'Please enter your email and password.',
  invalid: 'Email or password is incorrect.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? 'Could not sign in.' : null;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" required />
        {message ? (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign in
        </button>
        <p className="text-sm text-gray-600">
          No account?{' '}
          <Link href="/register" className="font-medium underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
