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
          <Card className="mx-auto w-11/12">
            <CardHeader>
              <CardTitle className="mb-2">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-scroll">
                  {data.map((u, i) => {
                    const l = u.location_data;
                    return (
                      <TableRow key={i}>
                        <TableCell>{u.user.name}</TableCell>
                        <TableCell className="font-bold">{l ? l.location : '<UNKNOWN>'}</TableCell>
                        <TableCell>{u.user.role}</TableCell>
                        <TableCell>
                          {l
                            ? l.lastUpdate.toLocaleDateString('us', {
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectRSC>
  );
}
