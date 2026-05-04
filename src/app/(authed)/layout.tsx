import Link from 'next/link';
import { requireEmployer } from '@/lib/auth';
import { logout } from '../login/actions';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const employer = await requireEmployer();

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold">
              Triangle ID
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-black">
              Credentials
            </Link>
            <Link href="/issue" className="text-sm text-gray-700 hover:text-black">
              Issue
            </Link>
            <Link href="/settings" className="text-sm text-gray-700 hover:text-black">
              Settings
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{employer.email}</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-700 underline hover:text-black">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
