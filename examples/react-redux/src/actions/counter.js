import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants';
import { EventTypes } from 'redux-segment';

export function increment() {
  return {
    type: INCREMENT_COUNTER,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}
