'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function ProtectRSC({
  children,
  forAdmin = false,
}: {
  children: React.ReactNode;
  forAdmin?: boolean;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/sign-in');
  }

  // @ts-expect-error Betterauth is not properly typed and says the user object does not include the role feild.
  if (forAdmin && session.user.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
