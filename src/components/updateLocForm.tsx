'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormStatus } from 'react-dom';
import { Loader } from 'lucide-react';
import { BlurIn } from './blurIn';

interface Props {
  updateLocationWithSession: (formData: FormData) => Promise<void>;
  locations: {
    name: string;
  }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-56 cursor-pointer" disabled={pending}>
      {pending ? <Loader className="animate-spin" /> : 'Update'}
    </Button>
  );
}

export function UpdateLocForm({ updateLocationWithSession, locations }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Location</CardTitle>
      </CardHeader>
      <form className="contents" action={updateLocationWithSession}>
        <CardContent className="contents">
          <BlurIn className="flex flex-1 flex-col items-center justify-center gap-2">
            <Select name="loc">
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem value={l.name} key={l.name}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <SubmitButton />
          </BlurIn>
        </CardContent>
      </form>
    </Card>
  );
}
