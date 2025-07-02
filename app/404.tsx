'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const params = useSearchParams();
  return <div>Sorry, page not found. Query: {params.get('q')}</div>;
}
