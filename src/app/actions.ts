'use server';

import { db } from '@/lib/db';
import { locationData } from '@/lib/db/schema';
import type { User } from 'better-auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateLocation(user: User | undefined, formData: FormData) {
  if (!user) return;
  const location = formData.get('loc') as string;
  if (!location) return;
  const { id, name } = user;

  // Create row if not exists, update otherwise.
  const rowExists = (await db.select().from(locationData).where(eq(locationData.user, id))).length !== 0;
  if (rowExists) {
    await db.update(locationData).set({ lastUpdate: new Date(), location }).where(eq(locationData.user, id));
  } else {
    console.log(`No row for ${name}. Creating it.`);
    await db.insert(locationData).values({
      user: id,
      location,
    });
  }

  revalidatePath('/');
}
