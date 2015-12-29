import test from 'tape';
import { compose, createStore, applyMiddleware } from 'redux';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker, EventTypes } from '../src/index';


test('Alias - spec', t => {
  t.test('default', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'SIGN_IN';
    const explicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.alias,
        },
      },
    };
    const implicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: EventTypes.alias,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    const explicitEvent = () => store.dispatch(explicitAction);
    st.throws(explicitEvent, /missing userId/, 'throws error when userId prop is missing');

    const implicitEvent = () => store.dispatch(implicitAction);
    st.throws(implicitEvent, /missing userId/, 'throws error when userId props is missing');


    window.analytics = null;
  });
});
