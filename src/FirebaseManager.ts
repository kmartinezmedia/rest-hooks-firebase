import {
  MiddlewareAPI,
  Middleware,
  SubscribeAction,
  UnsubscribeAction,
  Manager,
  Dispatch,
} from 'rest-hooks';
import {
  SUBSCRIBE_TYPE,
  UNSUBSCRIBE_TYPE,
  RECEIVE_TYPE,
} from 'rest-hooks/lib/actionTypes';

import FirebaseClient from './FirebaseClient';

export type Handler = { dispatch: Dispatch<any>; url: string };

export default class FirebaseManager implements Manager {
  protected subscriptionHandlers: {
    [subscription: string]: { dispatch: Dispatch<any>; url: string };
  } = {};

  firebase: FirebaseClient;
  protected declare middleware: Middleware;

  protected handleSubscribe(action: SubscribeAction, dispatch: Dispatch<any>) {
    const subscription = action.meta?.options?.extra?.subscription;
    const url = action.meta.url;
    if (!subscription) return;
    if (!(subscription in this.subscriptionHandlers)) {
      const handler = { dispatch, url, action };
      this.subscriptionHandlers[subscription] = handler;
      this.firebase.subscriptionHandlers[subscription](handler);
    }
  }

  protected handleUnsubscribe(action: UnsubscribeAction) {
    const subscription = action.meta?.options?.extra?.subscription;
    if (!subscription) return;
    if (subscription in this.subscriptionHandlers) {
      delete this.subscriptionHandlers[subscription];
    } else if (process.env.NODE_ENV !== 'production') {
      console.error(
        `Mismatched unsubscribe: ${subscription} is not subscribed`,
      );
    }
  }

  /** Ensures all subscriptions are cleaned up. */
  cleanup() {
    // TODO
  }

  getMiddleware<T extends FirebaseManager>(this: T) {
    return this.middleware;
  }

  constructor() {
    this.firebase = new FirebaseClient();
    this.middleware = <R extends React.Reducer<any, any>>({
      dispatch,
    }: MiddlewareAPI<R>) => {
      return (next: Dispatch<R>) => (action: React.ReducerAction<R>) => {
        switch (action.type) {
          case SUBSCRIBE_TYPE:
            if (action.meta.options?.pollFrequency === 0) {
              this.handleSubscribe(action, dispatch);
            }
            return Promise.resolve();
          case UNSUBSCRIBE_TYPE:
            if (action.meta.options?.pollFrequency === 0) {
              this.handleUnsubscribe(action);
            }
            return Promise.resolve();
          case RECEIVE_TYPE:
            // debugger;
            // only receive after new state is computed
            return next(action).then(() => {
              // handle receive here
            });
          default:
            return next(action);
        }
      };
    };
  }
}
