import { db } from '@/lib/db';
import type { BetterAuthPlugin } from 'better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { openAPI, username } from 'better-auth/plugins';
import { admin } from 'better-auth/plugins';

// Plugin Lists
const devPlugins: BetterAuthPlugin[] = [openAPI()];
const basePlugins: BetterAuthPlugin[] = [nextCookies(), username(), admin()];

export const auth = betterAuth({
  plugins: process.env.NODE_ENV === 'development' ? [...basePlugins, ...devPlugins] : basePlugins,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
});
