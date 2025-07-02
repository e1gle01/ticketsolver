// app/404.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchParamsReader() {
  const params = useSearchParams();
  return <p>Page not found. (Search param: {params.get('q') ?? 'none'})</p>;
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<p>Loading 404...</p>}>
      <SearchParamsReader />
    </Suspense>
  );
}
