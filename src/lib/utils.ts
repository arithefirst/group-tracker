import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getZodMsg(zodError: ZodError | undefined, key: string) {
  if (!zodError) return '';
  const error = zodError.errors.filter((e) => (e.path[0] as string) === key)[0];
  return error ? error.message : '';
}
