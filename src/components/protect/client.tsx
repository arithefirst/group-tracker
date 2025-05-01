'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

export default function ProtectClient({
  children,
  forAdmin = false,
}: {
  children: ReactNode;
  forAdmin?: boolean;
}) {
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

    if (forAdmin && !isPending && data?.user.role !== 'admin') {
      router.push('/');
    }
  }, [isPending, data, router, forAdmin]);

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

  if (data && ((data.user.role === 'admin' && forAdmin) || !forAdmin)) {
    return <>{children}</>;
  }

  return null;
}
