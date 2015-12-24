# Redux Segment
<img src="./logo.png" width="48"> _Segment.io analytics integration for redux._  

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/redux-segment)

```
npm install --save redux-segment
```

---
<img src="./segment.gif">


## Motivation

Redux Segment middleware allows you to draw deep and rich analytics from
your Redux application with minimal configuration. You are already
specifying the [actions](https://github.com/rackt/redux/blob/master/docs/basics/Actions.md)
you care about:

```
export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    payload: {
      text,
    },
  }
}
```

Just tell the middleware you also want it tracked:

```
export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    payload: {
      text,
    },
    meta: {
      analytics: {
        eventType: reduxSegment.TRACK,
        eventName: types.ADD_TODO,
        paths: ['payload.text'],  // It understands [Flux Standard Action](https://github.com/acdlite/redux-actions)
                                  // so the 'payload' part is not required.
      },
    },
  }
}
```

Or if you want to save keystrokes:

```
export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    payload,
    meta: {
      analytics: reduxSegment.TRACK,
    },
  }
}
```

That's all! :smile:

### What is Segment?

[Segment](https://segment.com) is a platform that allows you to collect
your analytics data with one API and send it to hundreds of tools (e.g.
Google Analytics, Mixpanel, Slack, etc...) or data warehousing.
Crucially, it also allows you to own your data in raw format.

### Can I just write one line that tells the middleware to track everything?

No. This is tempting to do, especially in Redux where your application
state is small and centralized and changes are explicit. You should,
however, resist the temptation. This constraint is core to the **design
philosophy** of Redux Segment.

> Analytics is about **learning**  
<img src="https://pbs.twimg.com/media/CTeedmKWEAAtR44.png">

-- [@segment](https://twitter.com/segment)

Tracking everything, in many cases, is equivalent to tracking nothing at
all. In practice, we are forced to think about analytics differently.

The _Lean Startup_ methodology advocates applying a *scientific approach*
to product development. The rationale, as it goes, is that the faster a
team learns, the more likely they are to succeed. The process occurs in
roughly three phases:

1. Build (idea -> code)

    In phase 1, the team builds something they think their users want. The
result is an experimental feature.

2. Measure (code -> data/analytics)

    In phase 2, the team collects data on how users are reacting to the
feature. This is the experiment.

3. Learn (data/analytics -> ideas)

    In phase 3, the team uses the data collected to determine if the
experiment was a success or not. They can then use what they learned to
drive more ideas.

And so the cycle continues...

**Redux Segment is designed to allow you to _measure_ faster.** First,
choose what you want to learn. Build it. Then, determine how you're
going to meaure it. And finally, collect the result.

_You can, of course, still track all actions if you want by explictly
marking each one._


## Installation
```
npm install --save redux-segment
```


## Usage

**1. Create and apply the tracker**
```
import { applyMiddleware, createStore, compose } from 'redux';
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'
import routes from '../routes'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import rootReducer from '../reducers'
import { createTracker } from 'redux-segment';

const tracker = createTracker();  // Create the tracker...

const finalCreateStore = compose(
  applyMiddleware(thunk, api, tracker),  // and then apply it!
  reduxReactRouter({ routes, createHistory })
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}
```
_Note: Make sure to include the tracker *after* thunk or promise
middleware so that it sees actual actions._

**2. Copy the segment snippet into the header of your site**
```
<head>
  <title>My amazing app</title>
  ...
  <script type="text/javascript">
    !function(){var
  analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment
  snippet included
  twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return
  function(){var
  e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return
  analytics}};for(var t=0;t<analytics.methods.length;t++){var
  e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var
  e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var
  n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load("YOUR_WRITE_KEY");
    // Make sure to remove any calls to `analytics.page()`!
    }}();
  </script>
</head>
```

**3. You're done!**


## License

Code and documentation copyright 2015-2016 Rangle.io. Code released
under the [MIT license](./LICENSE). Docs released under Creative Commons.
