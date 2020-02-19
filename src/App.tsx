import React from 'react';
import { useSubscription } from 'rest-hooks';

import Posts from 'pages/Posts';
import PostResource from 'resources/PostResource';
// import UserResource from 'resources/UserResource';

export default function App() {
  // useSubscription(UserResource.firebaseCurrentShape(), {});
  useSubscription(PostResource.firebaseListShape(), {});
  return <Posts />;
}
