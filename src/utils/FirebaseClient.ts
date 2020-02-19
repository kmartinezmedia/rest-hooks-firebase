import * as firebase from 'firebase';
import { RECEIVE_TYPE } from 'rest-hooks/lib/actionTypes';

import UserResource from 'resources/UserResource';

import { Handler } from './FirebaseManager';

export type FirebaseDoc = firebase.firestore.DocumentData;
export type FirebaseGeoPoint = firebase.firestore.GeoPoint;
export type FirebaseTimestamp = firebase.firestore.Timestamp;

class FirebaseClient {
  protected db: firebase.firestore.Firestore;
  protected auth: firebase.auth.Auth;

  subscriptionHandlers: {
    [subscription: string]: (handler: Handler) => void;
  } = {
    user: handler => this.watchUser(handler),
    posts: ({ dispatch, url }) =>
      this.watchCollection('posts', payload =>
        dispatch({
          type: RECEIVE_TYPE,
          payload,
          meta: {
            url,
          },
        }),
      ),
  };

  subscriptions: {
    [subscription: string]: firebase.Unsubscribe;
  } = {};

  watchUser({ dispatch, url }: { dispatch: Function; url: string }): void {
    this.auth.onAuthStateChanged((auth: firebase.User | null) => {
      if (auth) {
        const unsubscribe = this.watchDoc(
          `users/${auth.uid}`,
          (payload: UserResource) => {
            if (payload) {
              dispatch({
                type: RECEIVE_TYPE,
                payload,
                meta: {
                  url,
                },
              });
            }
          },
        );
        this.subscriptions['user'] = unsubscribe;
      }
    });
  }

  watchDoc<T extends FirebaseDoc>(
    doc: string,
    cb: (docSnapshot: T) => void,
  ): firebase.Unsubscribe {
    return this.db.doc(doc).onSnapshot(resp => {
      const data = resp.data();
      if (data) cb(data as T);
    });
  }

  watchCollection<T extends FirebaseDoc>(
    collection: string,
    cb: (collectionSnapshot: Array<T>) => void,
  ): firebase.Unsubscribe {
    return this.db.collection(collection).onSnapshot(resp => {
      const docs: Array<T> = [];
      resp.forEach(doc => {
        if (doc) {
          const data = doc.data();
          if (data) docs.push(data as T);
        }
      });
      cb(docs);
    });
  }

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyCBcSPJTXM7irooJ7jFxrowEjnxr16sn9E',
        authDomain: 'chummy-43fd3.firebaseapp.com',
        databaseURL: 'https://chummy-43fd3.firebaseio.com',
        projectId: 'chummy-43fd3',
        storageBucket: 'chummy-43fd3.appspot.com',
        messagingSenderId: '107942459785',
        appId: '1:107942459785:web:d37716b77d5b9e4672c958',
      });
    }
    this.db = firebase.firestore();
    this.auth = firebase.auth();
  }
}

export default new FirebaseClient();
