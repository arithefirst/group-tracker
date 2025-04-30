'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { FormEvent, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { ErrorContext } from 'better-auth/client';
import z, { ZodError } from 'zod';
import { getZodMsg } from '@/lib/utils';

type AuthError = ErrorContext & { responseText?: string };

const schema = z.object({
  username: z.string().nonempty('Username must not be empty'),
  password: z.string().nonempty('Password must not be empty'),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<AuthError | undefined>();
  const [zodError, setZodError] = useState<ZodError | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function zValidate(obj: any): { error?: ZodError } {
    const { error } = schema.safeParse(obj);
    setZodError(error);
    if (error) return { error };
    return {};
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();

    // Check the schema with Zod
    const { error } = zValidate({
      username,
      password,
    });

    if (error) return;

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
        onSuccess: () => {
          setError(undefined);
        },
      },
    );
  }

  useEffect(() => {
    zValidate({ username, password });
  }, [username, password]);

  return (
    <form onSubmit={signIn} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-muted-foreground text-sm">Enter your username below to sign in to your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid">
          <Label htmlFor="username" className="mb-2">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="jane_doe"
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
          />
          <span className="mt-0.5 text-xs text-red-700">{getZodMsg(zodError, 'username')}</span>
        </div>
        <div className="grid">
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="MySuperS3curePassw0rd!"
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <span className="mt-0.5 text-xs text-red-700">{getZodMsg(zodError, 'password')}</span>
        </div>
        <Button
          type="submit"
          className={`w-full ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Sign In'}
        </Button>
        {error ? (
          <span className="text-red-700">
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
      </div>
    </form>
  );
}
