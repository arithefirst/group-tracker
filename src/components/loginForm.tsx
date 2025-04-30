'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { FormEvent, useState } from 'react';
import { Loader } from 'lucide-react';
import { ErrorContext } from 'better-auth/client';

type AuthError = ErrorContext & { responseText?: string };

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<AuthError | undefined>();

  async function signIn(e: FormEvent) {
    e.preventDefault();

    await authClient.signIn.username(
      {
        username,
        password,
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (e) => {
          setError(e);
        },
      },
    );
  }

  return (
    <form onSubmit={signIn} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your username below to sign in to your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="jane_doe"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="MySuperS3curePassw0rd!"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <span className="text-red-600">
            {(() => {
              try {
                const message = JSON.parse(error.responseText!).message;
                return message.charAt(0).toUpperCase() + message.slice(1);
              } catch {
                return 'An unexpected error occurred.';
              }
            })()}
            .
          </span>
        ) : (
          ''
        )}
        <Button type="submit" className="w-full" disabled={isLoading} aria-disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
