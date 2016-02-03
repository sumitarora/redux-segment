export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

const reduxSegment = require('redux-segment');

export function increment() {
  return {
    type: INCREMENT_COUNTER,
    meta: {
      analytics: {
        eventType: reduxSegment.EventTypes.track,
        eventPayload: {
          name: INCREMENT_COUNTER
        }
      }
    }
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER,
    meta: {
      analytics: {
        eventType: reduxSegment.EventTypes.track,
        eventPayload: {
          name: INCREMENT_COUNTER
        }
      }
    }
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
