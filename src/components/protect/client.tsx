'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

export default function ProtectClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !data) {
      router.push('/auth/sign-in');
    }
  }, [isPending, data, router]);

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  if (isPending) {
    return (
      <div className="bg-background/30 fixed flex h-screen w-screen items-center justify-center backdrop-blur-sm">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  if (data) {
    return <>{children}</>;
  }

  return null;
}
