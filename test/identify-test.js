import test from 'tape';
import { compose, createStore, applyMiddleware } from 'redux';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker, EventTypes } from '../src/index';


test('Identify - spec', t => {
  t.test('default', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const explicitAction = {
      type: 'SIGN_IN',
      meta: {
        analytics: {
          eventType: EventTypes.identify,
        },
      },
    };
    const implicitAction = {
      type: 'SIGN_IN',
      meta: {
        analytics: EventTypes.identify,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(explicitAction);
    const defaultExplicitEvent = window.analytics[0] && window.analytics[0][0];
    st.equal(defaultExplicitEvent, 'identify', 'emits an event on explicit actions');

    store.dispatch(implicitAction);
    const defaultImplicitEvent = window.analytics[1] && window.analytics[1][0];
    st.equal(defaultImplicitEvent, 'identify', 'emits a page event on implicit actions');


    window.analytics = null;
  });
});
