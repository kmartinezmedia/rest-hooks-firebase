import React, { Suspense } from 'react';
import { CacheProvider } from 'rest-hooks';

import FirebaseClient from 'utils/FirebaseClient';
import FirebaseManager from 'utils/FirebaseManager';

export default function RootProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  return (
    <CacheProvider
      managers={[
        new FirebaseManager({ firebase: FirebaseClient }),
        ...CacheProvider.defaultProps.managers,
      ]}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </CacheProvider>
  );
}
