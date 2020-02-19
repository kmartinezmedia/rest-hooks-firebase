import React, { Suspense } from 'react';
import { CacheProvider } from 'rest-hooks';

import FirebaseManager from './FirebaseManager';

export default function RootProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  return (
    <CacheProvider
      managers={[new FirebaseManager(), ...CacheProvider.defaultProps.managers]}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </CacheProvider>
  );
}
