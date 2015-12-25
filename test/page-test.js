import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import createAnalyticsStub from './helpers/segment-stub';
import { createTracker } from '../src/index';


test('Page - router support', t => {
  t.test('redux-simple-router', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const node = document.createElement('div');
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
    const history = createHistory();
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
});

