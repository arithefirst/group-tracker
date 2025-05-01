'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function SignOut() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push('/auth/sign-in');
  }

  return (
    <Button size="sm" className="cursor-pointer" onClick={signOut}>
      <LogOut /> Sign Out
    </Button>
  );
}
