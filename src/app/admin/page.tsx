import { ProtectRSC } from '@/components/protect/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/db';
import { locationData, user } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { SignOut } from '@/components/signOut';

export default async function AdminPage() {
  const promises = await Promise.all([
    await db.select().from(user).leftJoin(locationData, eq(user.id, locationData.user)).orderBy(asc(user.name)),
    await auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  const data = promises[0];
  const session = promises[1];

  return (
    <ProtectRSC forAdmin>
      <div className="flex min-h-screen w-screen flex-col">
        <header className="bg-muted flex h-16 w-full items-center p-4 shadow-sm">
          <p className="text-2xl">
            Hi, <span className="font-bold">{session?.user.name} (admin)</span>
          </p>
          <SignOut />
        </header>
        <main className="grid w-full flex-grow gap-4 p-4">
          <Card className="mx-auto w-full sm:w-11/12">
            <CardHeader>
              <CardTitle className="mb-2">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-0">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="hidden sm:table-cell">Role</TableHead>
                      <TableHead className="hidden sm:table-cell">Last updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((u, i) => {
                      const l = u.location_data;
                      return (
                        <TableRow key={i} className="overflow-x-scroll">
                          <TableCell>{u.user.name}</TableCell>
                          <TableCell className="font-bold">{l ? l.location : '<UNKNOWN>'}</TableCell>
                          <TableCell className="hidden sm:table-cell">{u.user.role}</TableCell>
                          <TableCell>
                            {l
                              ? (() => {
                                  const now = new Date();
                                  const lastUpdate = l.lastUpdate;
                                  const diffMs = now.getTime() - lastUpdate.getTime();
                                  const diffSec = Math.round(diffMs / 1000);
                                  const diffMin = Math.round(diffSec / 60);
                                  const diffHour = Math.round(diffMin / 60);
                                  const diffDay = Math.round(diffHour / 24);

                                  if (diffSec < 60) return `${diffSec} seconds ago`;
                                  if (diffMin < 60) return `${diffMin} minutes ago`;
                                  if (diffHour < 24) return `${diffHour} hours ago`;
                                  return `${diffDay} days ago`;
                                })()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectRSC>
  );
}
