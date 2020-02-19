import { Resource, SimpleResource } from 'rest-hooks';

import { FirebaseTimestamp } from 'utils/FirebaseClient';

export default class UserResource extends Resource {
  readonly id: string = '';
  readonly active: boolean = false;
  readonly lastLogin: FirebaseTimestamp | undefined;
  readonly firstName: string = '';
  readonly lastName: string = '';
  readonly fullName: string = '';
  readonly email: string = '';
  readonly provider: string = '';
  readonly providerId: string = '';
  readonly avatar: string = '';

  pk(): string {
    return this.id;
  }

  static firebaseCurrentShape<T extends typeof SimpleResource>(this: T) {
    return {
      ...this.detailShape(),
      getFetchKey: () => {
        return '/current_user/';
      },
      options: {
        pollFrequency: 0,
        extra: {
          subscription: 'user',
        },
      },
    };
  }
}
