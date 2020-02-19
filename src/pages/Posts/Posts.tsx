import React from 'react';
import { useCache } from 'rest-hooks';

import PostResource from 'resources/PostResource';

const Posts = () => {
  const posts = useCache(PostResource.listShape(), {});
  return (
    <div>
      <h1>Posts</h1>
      {posts ? posts.map(item => <p key={item.id}>{item.id}</p>) : null}
    </div>
  );
};

export default Posts;
