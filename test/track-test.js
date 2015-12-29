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
      // type: true,
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

  t.test('event', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'CHECKOUT';
    const EVENT_NAME = 'Completed Order';
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: EVENT_NAME,
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
    st.deepEqual(event, ['track', EVENT_NAME], 'passes along the event name when the event name is explicit');


    window.analytics = null;
  });

  t.test('properties', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'CHECKOUT';
    const EVENT_NAME = 'Completed Order';
    const PROPERTIES = {
      orderId: '50314b8e9bcf000000000000',
      total: 30,
      revenue: 25,
      shipping: 3,
      tax: 2,
      discount: 2.5,
      coupon: 'hasbros',
      currency: 'USD',
      products: [
        {
          id: '507f1f77bcf86cd799439011',
          sku: '45790-32',
          name: 'Monopoly: 3rd Edition',
          price: 19,
          quantity: 1,
          category: 'Games',
        },
        {
          id: '505bd76785ebb509fc183733',
          sku: '46493-32',
          name: 'Uno Card Game',
          price: 3,
          quantity: 2,
          category: 'Games',
        },
      ],
    };
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: EVENT_NAME,
            properties: PROPERTIES,
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
    st.deepEqual(event, ['track', EVENT_NAME, PROPERTIES], 'passes along the properties of the event');


    window.analytics = null;
  });

  t.test('options', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'CHECKOUT';
    const EVENT_NAME = 'Completed Order';
    const PROPERTIES = {
      orderId: '50314b8e9bcf000000000000',
      total: 30,
      revenue: 25,
      shipping: 3,
      tax: 2,
      discount: 2.5,
      coupon: 'hasbros',
      currency: 'USD',
      products: [
        {
          id: '507f1f77bcf86cd799439011',
          sku: '45790-32',
          name: 'Monopoly: 3rd Edition',
          price: 19,
          quantity: 1,
          category: 'Games',
        },
        {
          id: '505bd76785ebb509fc183733',
          sku: '46493-32',
          name: 'Uno Card Game',
          price: 3,
          quantity: 2,
          category: 'Games',
        },
      ],
    };
    const OPTIONS = {
      'All': false,
      'Mixpanel': true,
      'KISSmetrics': true,
    };
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: EVENT_NAME,
            properties: PROPERTIES,
            options: OPTIONS,
          },
        },
      },
    };
    const noPropertiesAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: EVENT_NAME,
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
    st.deepEqual(event, ['track', EVENT_NAME, PROPERTIES, OPTIONS], 'passes along the options of the event');

    store.dispatch(noPropertiesAction);
    const noPropertiesEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
      window.analytics[1] && window.analytics[1][2],
    ];
    st.deepEqual(noPropertiesEvent, ['track', EVENT_NAME, OPTIONS], 'passes along the options of the event when properties are not present');


    window.analytics = null;
  });
});
