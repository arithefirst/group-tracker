'use client';
import ProtectClient from '@/components/protect/client';

export default function AdminPage() {
  return (
    <ProtectClient forAdmin>
      <div>Hello World</div>
    </ProtectClient>
  );
}
