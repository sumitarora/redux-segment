import test from 'tape';
import { compose, createStore, applyMiddleware } from 'redux';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker, EventTypes } from '../src/index';


test('Track - spec', t => {
  t.test('default', st => {
    st.plan(3);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'CHECKOUT';
    const explicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.track,
        },
      },
    };
    const implicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: EventTypes.track,
      },
    };
    const notInferableAction = {
      type: true,
      meta: {
        analytics: EventTypes.track,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(explicitAction);
    const defaultExplicitEvent = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
    ];
    st.deepEqual(defaultExplicitEvent, ['track', EVENT_TYPE], 'emits a track event with an inferred event name on explicit actions');

    store.dispatch(implicitAction);
    const defaultImplicitEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
    ];
    st.deepEqual(defaultImplicitEvent, ['track', EVENT_TYPE], 'emits a track event with an inferred event on implicit actions');

    const invalidAction = () => store.dispatch(notInferableAction);
    st.throws(invalidAction, /missing event/, 'throws error when event prop is missing and cannot be inferred');


    window.analytics = null;
  });
});
