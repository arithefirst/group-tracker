import { ProtectRSC } from '@/components/protect/server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateLocForm } from '@/components/updateLocForm';
import { UpdateText } from '@/components/updateText';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { approvedLocations, locationData } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { MapPin } from 'lucide-react';
import { headers } from 'next/headers';
import { updateLocation } from './actions';
import { SignOut } from '@/components/signOut';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const data = await Promise.all([
    await db
      .select()
      .from(locationData)
      .where(eq(locationData.user, session?.user.id ?? 'null')),
    await db.select().from(approvedLocations),
  ]);

  const location = data[0];
  const locations = data[1];
  const updateLocationWithSession = updateLocation.bind(null, session?.user);

  const noRows = location.length === 0;

  return (
    <ProtectRSC>
      <div className="flex min-h-screen w-screen flex-col">
        <header className="bg-muted flex h-16 w-full items-center p-4 shadow-sm">
          <p className="text-2xl">
            Hi, <span className="font-bold">{session?.user.name}</span>
          </p>
          <SignOut />
        </header>
        <main className="grid w-full flex-grow gap-4 p-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Last Updated Location</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center justify-center">
              {noRows ? (
                <>
                  <h1 className="text-3xl">No location data.</h1>
                  <p>If this is your first time signing in, set your current location.</p>
                </>
              ) : (
                <div className="grid gap-2">
                  <p className="ml-1">You&apos;re at the...</p>
                  <div className="flex items-center gap-2 text-4xl">
                    <MapPin className="size-8" />
                    <h1 className="font-bold">{location[0].location}</h1>
                  </div>
                  <UpdateText lastUpdate={location[0].lastUpdate} hours={3} />
                </div>
              )}
            </CardContent>
            {noRows ? (
              <></>
            ) : (
              <CardFooter className="text-muted-foreground text-sm">
                Last updated at{' '}
                {location[0].lastUpdate.toLocaleDateString('en', {
                  timeZoneName: 'short',
                  minute: 'numeric',
                  hour: 'numeric',
                  second: 'numeric',
                })}
              </CardFooter>
            )}
          </Card>
          <UpdateLocForm updateLocationWithSession={updateLocationWithSession} locations={locations} />
        </main>
      </div>
    </ProtectRSC>
  );
}
