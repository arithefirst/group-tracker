'use client';

import { useEffect, useState } from 'react';

interface Props {
  lastUpdate: Date;
  hours: number;
}

function getTimeString(s: number): string {
  if (s === 0) {
    return '0:00:00';
  }

  const absSeconds = Math.abs(s);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = Math.floor(absSeconds % 60);

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function UpdateText({ lastUpdate, hours }: Props) {
  const s = hours * 3600;
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeRemaining(s - Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)),
      1000,
    );

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <p className="ml-1 text-sm">
      Next update due{' '}
      {timeRemaining >= 0 ? (
        <>
          in <span className="font-bold">{getTimeString(timeRemaining)}</span>
        </>
      ) : (
        <>
          <span className="font-bold text-red-600">{getTimeString(timeRemaining)}</span> ago
        </>
      )}
    </p>
  );
}
