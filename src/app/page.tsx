import { BlurIn, AnimateHeading } from '@/components/anim';
import { ProtectRSC } from '@/components/protect/server';
import { SignOut } from '@/components/signOut';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateLocForm } from '@/components/updateLocForm';
import { UpdateText } from '@/components/updateText';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { approvedLocations, locationData } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { MapPin, ShieldUser } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { updateLocation } from './actions';

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
          <p className="text-xl md:text-2xl">
            Hi, <span className="font-bold">{session?.user.name}</span>
          </p>
          <div className="ml-auto flex cursor-pointer gap-2">
            {
              // @ts-expect-error Betterauth is not properly typed and says the user object does not include the role feild.
              session?.user.role === 'admin' ? (
                <Link className={buttonVariants({ size: 'sm' })} href="/admin">
                  <ShieldUser /> Admin
                </Link>
              ) : (
                ''
              )
            }
            <SignOut />
          </div>
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
                <BlurIn className="grid gap-2">
                  <p className="ml-1">You&apos;re at the...</p>
                  <div className="flex items-center gap-2 text-4xl">
                    <MapPin className="size-8" />
                    <AnimateHeading className="font-bold" aKey={location[0].location}>
                      {location[0].location}
                    </AnimateHeading>
                  </div>
                  <UpdateText lastUpdate={location[0].lastUpdate} hours={3} />
                </BlurIn>
              )}
            </CardContent>
            {noRows ? (
              <></>
            ) : (
              <CardFooter className="text-muted-foreground text-sm">
                <BlurIn>
                  Last updated at{' '}
                  {location[0].lastUpdate.toLocaleDateString('en', {
                    timeZoneName: 'short',
                    minute: 'numeric',
                    hour: 'numeric',
                    second: 'numeric',
                    timeZone: 'America/New_York',
                  })}
                </BlurIn>
              </CardFooter>
            )}
          </Card>
          <UpdateLocForm updateLocationWithSession={updateLocationWithSession} locations={locations} />
        </main>
      </div>
    </ProtectRSC>
  );
}
