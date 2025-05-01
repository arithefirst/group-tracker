'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { cn, getZodMsg } from '@/lib/utils';
import { ErrorContext } from 'better-auth/client';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import z, { ZodError } from 'zod';

const schema = z
  .object({
    name: z.string().nonempty('Name cannot be empty.'),
    password: z
      .string()
      .nonempty('Password cannot be empty.')
      .min(8, 'Password must be at least 8 characters.')
      .regex(/(?=.*[A-Z])/gm, 'Password must contain an uppercase letter.')
      .regex(/(?=.*[a-z])/gm, 'Password must contain a lowercase letter.')
      .regex(/(?=.*\d)/gm, 'Password must contain a number.')
      .regex(/(?=.*\W)/gm, 'Password must contain a special character.'),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    verify: z.string(),
  })
  .refine((data) => data.password === data.verify, {
    message: 'Passwords do not match.',
    path: ['verify'],
  });

type AuthError = ErrorContext & { responseText?: string };

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [verify, setVerify] = useState<string>('');
  const [zodError, setZodError] = useState<ZodError | undefined>();
  const [error, setError] = useState<AuthError | undefined>();

  useEffect(() => {
    console.debug(verify, password);
  });

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
      name,
      verify,
    });

    if (error) return;

    await authClient.signUp.email(
      {
        username,
        password,
        email: `${v4()}@${v4()}.com`,
        name,
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (e) => {
          setError(e);
        },
        onSuccess: () => {
          setError(undefined);
          router.push('/');
        },
      },
    );
  }

  useEffect(() => {
    zValidate({
      username,
      password,
      name,
      verify,
    });
  }, [username, password, name, verify]);

  return (
    <form onSubmit={signIn} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm">Fill out the fields below to create your account</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid">
          <Label htmlFor="name" className="mb-2">
            Full Name
          </Label>
          <Input id="name" type="text" onInput={(e) => setName((e.target as HTMLInputElement).value)} />
          <span className="mt-0.5 text-xs text-red-700">{getZodMsg(zodError, 'name')}</span>
        </div>
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
        <div className="grid">
          <Label htmlFor="verify" className="mb-2">
            Verify Password
          </Label>
          <Input
            id="verify"
            type="password"
            placeholder="MySuperS3curePassw0rd!"
            onInput={(e) => setVerify((e.target as HTMLInputElement).value)}
          />
          <span className="mt-0.5 text-xs text-red-700">{getZodMsg(zodError, 'verify')}</span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button
          type="submit"
          className={`mt-5 w-full ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Sign Up'}
        </Button>
        {error ? (
          <span className="mx-auto text-red-700">
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
