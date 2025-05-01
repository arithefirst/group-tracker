import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-background/30 fixed flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <Loader className="animate-spin" size={24} />
    </div>
  );
}
