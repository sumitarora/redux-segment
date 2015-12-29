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

  t.test('userId', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const USER_ID = '507f191e810c19729de860ea';
    const EMAIL = 'test@example.org';
    const PASSWORD = 'supersecretssh!';
    const action = {
      type: 'SIGN_IN',
      email: EMAIL,
      password: PASSWORD,
      meta: {
        analytics: {
          eventType: EventTypes.alias,
          eventPayload: {
            userId: USER_ID,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
    ];
    st.deepEqual(event, ['alias', USER_ID], 'passes along the new userId of the user');


    window.analytics = null;
  });

  t.test('previousId', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const USER_ID = '507f191e810c19729de860ea';
    const PREVIOUS_ID = '019mr8mf4r';
    const EMAIL = 'test@example.org';
    const PASSWORD = 'supersecretssh!';
    const action = {
      type: 'SIGN_IN',
      email: EMAIL,
      password: PASSWORD,
      meta: {
        analytics: {
          eventType: EventTypes.alias,
          eventPayload: {
            userId: USER_ID,
            previousId: PREVIOUS_ID,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
      window.analytics[0] && window.analytics[0][2],
    ];
    st.deepEqual(event, ['alias', USER_ID, PREVIOUS_ID], 'passes along the previousId of the user');


    window.analytics = null;
  });

  t.test('options', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const USER_ID = '507f191e810c19729de860ea';
    const PREVIOUS_ID = '019mr8mf4r';
    const EMAIL = 'test@example.org';
    const PASSWORD = 'supersecretssh!';
    const OPTIONS = {
      'All': false,
      'Mixpanel': true,
      'KISSmetrics': true,
    };
    const action = {
      type: 'SIGN_IN',
      email: EMAIL,
      password: PASSWORD,
      meta: {
        analytics: {
          eventType: EventTypes.alias,
          eventPayload: {
            userId: USER_ID,
            previousId: PREVIOUS_ID,
            options: OPTIONS,
          },
        },
      },
    };
    const noPreviousIdAction = {
      type: 'SIGN_IN',
      email: EMAIL,
      password: PASSWORD,
      meta: {
        analytics: {
          eventType: EventTypes.alias,
          eventPayload: {
            userId: USER_ID,
            options: OPTIONS,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
      window.analytics[0] && window.analytics[0][2],
      window.analytics[0] && window.analytics[0][3],
    ];
    st.deepEqual(event, ['alias', USER_ID, PREVIOUS_ID, OPTIONS], 'passes along the options of the alias event');

    store.dispatch(noPreviousIdAction);
    const noPreviousIdEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
      window.analytics[1] && window.analytics[1][2],
    ];
    st.deepEqual(noPreviousIdEvent, ['alias', USER_ID, OPTIONS], 'passes along the options of the alias event when no previousId is provided');


    window.analytics = null;
  });
});
