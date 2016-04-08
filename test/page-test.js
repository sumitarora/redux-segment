import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import { ReduxRouter, routerStateReducer, reduxReactRouter } from 'redux-router';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker, EventTypes } from '../src/index';


test('Page - router support', t => {
  t.test('redux-simple-router', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const node = global.document.getElementById('app');

    const tracker = createTracker();
    const reducer = combineReducers({
      routing: routeReducer,
    });
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(reducer);
    const Component = () =>
      <div>
        <h1>Hello!</h1>
        <ul>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
        </ul>
      </div>;

    const history = useRouterHistory(createHashHistory)({ queryKey: false });
    syncReduxAndRouter(history, store);


    ReactDOM.render(
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Route path="/" component={Component}>
              <IndexRoute component={Component}/>
              <Route path="foo" component={Component}/>
              <Route path="bar" component={Component}/>
            </Route>
          </Router>
        </div>
      </Provider>,
      node
    );


    const initialEvent = window.analytics[0] && window.analytics[0][0];
    st.equal(initialEvent, 'page', 'triggers page event on load');

    const fooLink = node.querySelector('a[href$="foo"]');
    // Wait for route change to propagate to store
    store.subscribe(() => {
      const fooLinkEvent = window.analytics[1] && window.analytics[1][0];
      st.equal(fooLinkEvent, 'page', 'triggers page event on navigation');
      window.analytics = null;
    });
    fooLink.click();
    ReactDOM.unmountComponentAtNode(node);
  });

  t.test('redux-router', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const node = document.createElement('div');
    const tracker = createTracker();
    const reducer = combineReducers({
      router: routerStateReducer,
    });
    const history = useRouterHistory(createHashHistory)({ queryKey: false });
    const store = compose(
      reduxReactRouter({ history }),
      applyMiddleware(tracker)
    )(createStore)(reducer);
    const Component = () =>
      <div>
        <h1>Hello!</h1>
        <ul>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
        </ul>
      </div>;
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <ReduxRouter history={history}>
            <Route path="/" component={Component}>
              <IndexRoute component={Component}/>
              <Route path="foo" component={Component}/>
              <Route path="bar" component={Component}/>
            </Route>
          </ReduxRouter>
        </div>
      </Provider>,
      node
    );


    const initialEvent = window.analytics[0] && window.analytics[0][0];
    st.equal(initialEvent, 'page', 'triggers page event on load');

    const fooLink = node.querySelector('a[href$="foo"]');
    fooLink.click();
    const fooLinkEvent = window.analytics[1] && window.analytics[1][0];
    st.equal(fooLinkEvent, 'page', 'triggers page event on navigation');


    window.analytics = null;
    ReactDOM.unmountComponentAtNode(node);
  });
});


test('Page - spec', t => {
  t.test('default', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const explicitAction = {
      type: 'CHANGE_VIEW',
      meta: {
        analytics: {
          eventType: EventTypes.page,
        },
      },
    };
    const implicitAction = {
      type: 'CHANGE_VIEW',
      meta: {
        analytics: EventTypes.page,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(explicitAction);
    const defaultExplicitEvent = window.analytics[0] && window.analytics[0][0];
    st.equal(defaultExplicitEvent, 'page', 'emits a page event on explicit actions');

    store.dispatch(implicitAction);
    const defaultImplicitEvent = window.analytics[1] && window.analytics[1][0];
    st.equal(defaultImplicitEvent, 'page', 'emits a page event on implicit actions');


    window.analytics = null;
  });

  t.test('name', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const PAGE_NAME = 'Home';
    const action = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
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
    st.deepEqual(event, ['page', PAGE_NAME], 'passes along the name of the page');


    window.analytics = null;
  });

  t.test('category', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const PAGE_NAME = 'Home';
    const CAT_NAME = 'Landing';
    const action = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
            category: CAT_NAME,
          },
        },
      },
    };
    const missingNameAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            category: CAT_NAME,
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
    st.deepEqual(event, ['page', CAT_NAME, PAGE_NAME], 'passes along the category of the page');

    const invalidAction = () => store.dispatch(missingNameAction);
    st.throws(invalidAction, /missing name/, 'throws error when name prop is missing');


    window.analytics = null;
  });

  t.test('properties', st => {
    st.plan(3);


    window.analytics = createAnalyticsStub();
    const PAGE_NAME = 'Home';
    const CAT_NAME = 'Landing';
    const TITLE_NAME = 'Homepage';
    const action = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
            category: CAT_NAME,
            properties: {
              title: TITLE_NAME,
            },
          },
        },
      },
    };
    const noCategoryAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
            properties: {
              title: TITLE_NAME,
            },
          },
        },
      },
    };
    const justPropertiesAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            properties: {
              title: TITLE_NAME,
            },
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
    st.deepEqual(event, ['page', CAT_NAME, PAGE_NAME, { title: TITLE_NAME }], 'passes along the properties of the page when category is present');

    store.dispatch(noCategoryAction);
    const noCatEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
      window.analytics[1] && window.analytics[1][2],
    ];
    st.deepEqual(noCatEvent, ['page', PAGE_NAME, { title: TITLE_NAME }], 'passes along the properties of the page when category is not present');

    store.dispatch(justPropertiesAction);
    const justPropertiesEvent = [
      window.analytics[2] && window.analytics[2][0],
      window.analytics[2] && window.analytics[2][1],
    ];
    st.deepEqual(justPropertiesEvent, ['page', { title: TITLE_NAME }], 'passes along the properties of the page when category and name are not present');


    window.analytics = null;
  });

  t.test('options', st => {
    st.plan(4);


    window.analytics = createAnalyticsStub();
    const PAGE_NAME = 'Home';
    const CAT_NAME = 'Landing';
    const TITLE_NAME = 'Homepage';
    const PROPERTIES = {
      title: TITLE_NAME,
    };
    const OPTIONS = {
      'All': false,
      'Mixpanel': true,
      'KISSmetrics': true,
    };
    const action = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
            category: CAT_NAME,
            properties: PROPERTIES,
            options: OPTIONS,
          },
        },
      },
    };
    const noCategoryAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            name: PAGE_NAME,
            properties: {
              title: TITLE_NAME,
            },
            options: OPTIONS,
          },
        },
      },
    };
    const startAtPropertiesAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
            properties: {
              title: TITLE_NAME,
            },
            options: OPTIONS,
          },
        },
      },
    };
    const justOptionsAction = {
      type: 'CHANGE_VIEW',
      to: 'home',
      meta: {
        analytics: {
          eventType: EventTypes.page,
          eventPayload: {
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
      window.analytics[0] && window.analytics[0][4],
    ];
    st.deepEqual(event, ['page', CAT_NAME, PAGE_NAME, PROPERTIES, OPTIONS], 'passes along the options of the page event when category is present');

    store.dispatch(noCategoryAction);
    const noCatEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
      window.analytics[1] && window.analytics[1][2],
      window.analytics[1] && window.analytics[1][3],
    ];
    st.deepEqual(noCatEvent, ['page', PAGE_NAME, PROPERTIES, OPTIONS], 'passes along the options of the page event when category is not present');

    store.dispatch(startAtPropertiesAction);
    const startAtPropertiesEvent = [
      window.analytics[2] && window.analytics[2][0],
      window.analytics[2] && window.analytics[2][1],
      window.analytics[2] && window.analytics[2][2],
    ];
    st.deepEqual(startAtPropertiesEvent, ['page', PROPERTIES, OPTIONS], 'passes along the options of the page when only properties are present');

    store.dispatch(justOptionsAction);
    const optionsOnlyEvent = [
      window.analytics[3] && window.analytics[3][0],
      window.analytics[3] && window.analytics[3][1],
      window.analytics[3] && window.analytics[3][2],
    ];
    st.deepEqual(optionsOnlyEvent, ['page', {}, OPTIONS], 'passes along the options of the page when other properties are not present');


    window.analytics = null;
  });
});
