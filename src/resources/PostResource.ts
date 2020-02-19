import { Resource, SimpleResource } from 'rest-hooks';

import { FirebaseGeoPoint, FirebaseTimestamp } from 'utils/FirebaseClient';

export default class PostResource extends Resource {
  readonly id: string = '';
  readonly avatar: string = '';
  readonly firstName: string = '';
  readonly allowedViewers: string[] = [];
  readonly comments: string[] = [];
  readonly likes: string[] = [];
  readonly tags: string[] = [];
  readonly location: FirebaseGeoPoint | undefined;
  readonly createdAt: FirebaseTimestamp | undefined;
  readonly image: string = '';
  readonly caption: string = '';

  pk(): string {
    return this.id;
  }

  static firebaseListShape<T extends typeof SimpleResource>(this: T) {
    return {
      ...this.listShape(),
      getFetchKey: () => {
        return '/posts';
      },
      options: {
        pollFrequency: 0,
        extra: {
          subscription: 'posts',
        },
      },
    };
  }
}
