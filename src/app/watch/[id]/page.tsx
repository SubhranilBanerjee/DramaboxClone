'use client';

import React, { use } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { getDramaById, generateEpisodesForDrama } from '@/lib/data';
import { VerticalPlayer } from '@/components/VerticalPlayer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WatchDramaPage({ params }: PageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const drama = getDramaById(id);

  if (!drama) {
    notFound();
  }

  const episodes = generateEpisodesForDrama(drama);
  const epParam = searchParams.get('ep');
  const initialEpisodeNumber = epParam ? parseInt(epParam, 10) : 1;

  return (
    <div className="bg-[#07060e] min-h-screen">
      <VerticalPlayer
        drama={drama}
        episodes={episodes}
        initialEpisodeNumber={isNaN(initialEpisodeNumber) ? 1 : initialEpisodeNumber}
      />
    </div>
  );
}
