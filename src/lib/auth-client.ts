import { createAuthClient } from 'better-auth/client';
import { usernameClient } from 'better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient()],
});
