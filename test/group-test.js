import test from 'tape';
import { compose, createStore, applyMiddleware } from 'redux';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker, EventTypes } from '../src/index';


test('Group - spec', t => {
  t.test('default', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'JOIN_TEAM';
    const explicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
        },
      },
    };
    const implicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: EventTypes.group,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    const explicitEvent = () => store.dispatch(explicitAction);
    st.throws(explicitEvent, /missing groupId/, 'throws error when groupId prop is missing');

    const implicitEvent = () => store.dispatch(implicitAction);
    st.throws(implicitEvent, /missing groupId/, 'throws error when groupId props is missing');


    window.analytics = null;
  });
});
