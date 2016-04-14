# Redux Segment
<a href="./.tag"><img src="./logo.png" width="48"></a> _Segment.io analytics integration for redux._

[![CircleCI](https://img.shields.io/circleci/project/rangle/redux-segment.svg)](https://circleci.com/gh/rangle/redux-segment)
[![npm](https://img.shields.io/npm/v/redux-segment.svg)](https://www.npmjs.com/package/redux-segment)
[![GitHub
license](https://img.shields.io/github/license/rangle/redux-segment.svg)](https://github.com/rangle/redux-segment/blob/master/LICENSE)

```
npm install --save redux-segment
```

---
<img src="./segment.gif">


## Features

- Send your data to over 100 apps with the flip of a switch (e.g. Google
  Analytics, Mixpanel, Optimizely, Facebook Ads, Slack, Sentry, and many
more...).
  - You only need one snippet and you can turn integrations on and off
    whenever you want.
- Simultaneously load customer data into your data warehouse in minutes.
  - Query raw data with SQL
  - Analyze your products across web and mobile.
  - No API layer, no queue, no transform, no batch, no load...and no
    infrastructure maintenance costs
- Out-of-the-box support for popular routers:
  - [react-router-redux](https://github.com/rackt/react-router-redux) ✝: >=2.1.0 < 5
  - [redux-router](https://github.com/acdlite/redux-router): ^1.0.3
- Support for all key Segment specs:
  - Identify
  - Page
  - Track
  - Group
  - Alias

✝ Recommended router. You can also trigger page views manually.


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
        eventType: EventTypes.track,
        eventPayload: {
          name: types.ADD_TODO,
          text,
        },
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
      analytics: EventTypes.track,
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
going to measure it. And finally, collect the result.

_You can, of course, still track all actions if you want by explictly
marking each one._


## Installation
```
npm install --save redux-segment
```

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

const tracker = createTracker();                                   // Create the tracker...

const finalCreateStore = compose(
  applyMiddleware(thunk, api, tracker),                            // and then apply it!
  reduxReactRouter({ routes, createHistory })
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}
```
_Note: Make sure to include the tracker *after* thunk or promise
middleware so that it sees actual actions._

**2. Optional, Access Third Party Redux Libraries**
Provide an optional config object to `createTracker(customMapper)` to map third party Redux library ActionTypes to Segment EventTypes and replace out-of-the-box support (if necessary). Note that the mappings can be either simple EventTypes, or mappings to functions if required that returns state information and EventType.
 
```
import { EventTypes } from 'redux-segment'
const customMapper = {
  mapper: {
    '@@router/CALL_HISTORY_LOCATION': EventTypes.page,
    '@@router/UPDATE_LOCATION': EventTypes.page,
    '@@reduxReactRouter/replaceRoutes': (getState) => {
      return {
        eventType: EventTypes.page,
        eventPayload: {
            name: ActionType.ADD_TODO,
            text: getState().text,
        }
      }
    }
  }
}

const tracker = createTracker(customMapper);
```


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

**3. You're done! You can now start specifying events at your heart's
content.**

## Usage

### Spec API

- [**Identify**](#identify)
- [**Page**](#page)
- [**Track**](#track)
- [**Alias**](#alias)
- [**Group**](#group)


### Overview

In Redux Segment, events are declared on the action they represent. For
example:

```
import { EventTypes } from 'redux-segment';

function buy(cart, subtotal, tax, total) {
  return {
    type: 'CHECKOUT',
    payload: {
      cart,
      subtotal,
      tax,
      total,
    },
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

// or the short form...

function openCart() {
  return {
    type: 'OPEN_CART',
    meta: {
      analytics: EventTypes.track,
    },
  };
}
```

Event specifications are attached the the `analytics` property of the
action's `meta` key. When using the short-hand, required keys are
inferred.

**Common Properties:**

*eventType \<string\>* (required) – The type of event to emit. Each type represents
some distinct semantic information about your customer.
Available types:

- `EventTypes.identify`: who is the customer?
- `EventTypes.page`: what web page are they on?
- `EventTypes.track`: what are they doing?
- `EventTypes.group`: what account or organization are they part of?
- `EventTypes.alias`: what was their past identity?

See the [Segment Spec](https://segment.com/docs/spec/) for more details.

*eventPayload \<Object\>* – The fields associated with the event. Each event has a
few [common fields](https://segment.com/docs/spec/common/#structure).
The rest are covered below, on a type-by-type basis.


### Identify

> The identify call ties a customer and their actions to a recognizable
> ID and traits like their email, name, etc.
> [Spec: Identify](https://segment.com/docs/spec/identify/)

**Note:** You don't need an `identify` action for anonymous visits. It
will be inferred for you so you can ahead and use `page` or `track`
without worry.

**Type:**
`EventTypes.identify`

**Payload Fields:**

*userId \<string\>* – The database ID of the user. For anonymous
visitors, an `anonymousId` will be automatically generated so this field
can be omitted.

*traits \<Object\>* – A map of attributes about the user. These are
completely at your discretion but common ones include email and name. If
you don't provide a userId, the traits will be attributed to the
currently identified users (whether anonymous or not). The following
traits are reserved and have standardized meaning:

- `address` \<Object\>
- `age` \<number\>
- `avatar` \<string\>
- `birthday` \<Date\>
- `createdAt` \<Date\>
- `description` \<string\>
- `email` \<string\>
- `firstName` \<string\>
- `gender` \<string\>
- `id` \<string\>
- `lastName` \<string\>
- `name` \<string\>
- `phone` \<string\>
- `title` \<string\>
- `username` \<string\>
- `website` \<string\>

Traits are also useful for such things as marking users as having seen a
particular A/B test variation.

*options \<Object\>* – A map of [common
fields](https://segment.com/docs/spec/common/#structure). This can be
used to selectively enable or disable certain integrations or set
`anonymousId` or `userId` on an ad-hoc basis.


### Page

> The page call lets you record whenever a user sees a page of your
> website, along with any properties about the page.
> [Spec: Page](https://segment.com/docs/spec/page/)

**Type:**
`EventTypes.page`

**Payload Fields:**

*name \<string\>* – The name of the page (e.g. 'Home').

*category \<string\>* – The category of the page. This is used where page
names live under a broader category (e.g. 'Products').
<u>Note: If you specify a category, you must also provide a name.</u>

*properties \<Object\>* – A map of page properties. The following
properties are reserved and have standardized meaning:

- `url`
- `title`
- `referrer`
- `path`
- `name`
- `search`

If not explicitly specified, the above properties are implied. You can
also provide your own custom properties, if you want.

*options \<Object\>* – A map of [common
fields](https://segment.com/docs/spec/common/#structure). This can be
used to selectively enable or disable certain intergrations or set
`anonymousId` or `userId` on an ad-hoc basis. More routinely, it is
used to "backdate" events by setting the `timestamp` key to when the
event actually occurred (as opposed to when the action was dispatched).
This is useful for cases where an action may be triggered after a
significant wait (e.g. setTimeout, callback, animations, etc...) and you
want to capture the time of human action instead of, say, the time at
which that action was confirmed or some data was persisted.


### Track

> The track call is how you record any actions your users perform,
> along with any properties that describe the action.
> [Spec: Track](https://segment.com/docs/spec/track/)

**Type:**
`EventTypes.track`

**Payload Fields:**

*event \<string\>* – The name of the event you’re tracking. This field
is required but if you don't explicitly provide one, it will be
populated by the `type` value of the action\*. It's recommended that you
make event names human-readable and (hopefully) instantly recognizable.
It's further recommended that these names be built from a past-tense
verb and a noun (e.g. 'Bought Merchandise', 'Opened Cart', 'Favorited
Product', etc...). The following event names are reserved and have
standardized meaning:

<u>[A/B Testing Events](https://segment.com/docs/spec/ab-testing)</u>

- `Experiment Viewed`
> This event should be sent every time a customer sees a variation of an
> active A/B Test.

<u>[Ecommerce Events](https://segment.com/docs/spec/ecommerce)</u>

- `Viewed Product Category`
> This event fires when a visitor views a product category. That view
> might happen on a page or modal.

- `Viewed Product`
> This event fires when a visitor views a product. That view might
> happen on a page or preview modal.

- `Added Product` / `Removed Product`
> Fire the 'Added Product' event when a visitor adds a product to their
> shopping cart and the 'Removed Product' event when a visitor removes a
> product from their shopping cart.

- `Completed Order`
> The final step is to record a 'Completed Order' event when people
> complete your checkout process.

\* As of Redux 3.x, all actions MUST define a type property as per
   [FSA](https://github.com/acdlite/flux-standard-action).

*properties \<Object\>* – A map of event properties. Properties are
extra pieces of information tied to the event being tracked. They can
help provide additional context later when analyzing the events, and in
doing so, provide a more complete picture of what your users are doing.
The following properties are reserved and have standardized meaning:

- `name` \<string\> (reserved for future use)
- `revenue` \<number\>
- `currency` \<string\>
- `value` \<number\> (useful for events with intrinsic, but not monetary,
  value)

<u>[A/B Testing Events](https://segment.com/docs/spec/ab-testing)</u>

`Experiment Viewed`

- `experiment_id` \<string\>
- `experiment_name` \<string\>
- `variation_id` \<string\>
- `variation_name` \<string\>

<u>[Ecommerce Events](https://segment.com/docs/spec/ecommerce)</u>

`Viewed Product Category`

- `category` \<string>

`Viewed Product`

- `id`\* \<string\>
- `sku`\* \<string\>
- `name` \<string\>
- `price` \<string\>
- `category` \<string\>

* `id` and `sku` don't have to be different, but they can.

`Added Product` / `Removed Product`

- `id` \<string\>
- `sku` \<string\>
- `name` \<string\>
- `price` \<string\>
- `quantity` \<string\>
- `category` \<string\>

`Completed Order`

- `orderId` \<string\>
- `total` \<number\>
- `revenue` \<number\>
- `shipping` \<number\>
- `tax` \<number\>
- `discount` \<number\>
- `coupon` \<string\>
- `currency` \<string\>
- `products` \<Array\>

Be sure to include all `products` in the cart as event properties, with the
same properties as listed above (`id`, `sku`, `name`, `price`,
`quantity` and `category`)

*options \<Object\>* – A map of [common
fields](https://segment.com/docs/spec/common/#structure). This can be
used to selectively enable or disable certain integrations or set
`anonymousId` or `userId` on an ad-hoc basis.


### Alias

> The alias method is used to merge two user identities, effectively
> connecting two sets of user data as one.
> [Spec: Alias](https://segment.com/docs/spec/alias)

**It's important to note that most integrations will automatically alias
anonymous visitors the first time you dispatch an `EventTypes.identify` action. As
a result, this event is only needed to manage identities in some
integrations (e.g.
[KISSmetrics](https://segment.com/docs/integrations/kissmetrics#alias),
[Mixpanel](https://segment.com/docs/integrations/mixpanel#alias),
[Trak](https://segment.com/docs/integrations/trak.io/#alias) and
[Vero](https://segment.com/docs/integrations/vero#alias).**

**Type:**
`EventTypes.alias`

**Payload Fields:**

*userId \<string\>* (required) – The new database ID you want associated with the
user.

*previousId \<string\>* (required) – The old ID of the user. If omitted, it's
assumed to be the currently identified user’s ID (in the case of
anonymous visitors, this is the auto-generated `anonymousId`).

*options \<Object\>* – A map of [common
fields](https://segment.com/docs/spec/common/#structure). This can be
used to selectively enable or disable certain integrations or set
`anonymousId` or `userId` on an ad-hoc basis.


### Group

> The group API call is how you associate an individual user with a
> group—be it a company, organization, account, project, team or
> whatever other crazy name you came up with for the same concept!
> [Spec: Group](https://segment.com/docs/spec/group)

**Type:**
`EventTypes.group`

**Payload Fields:**

*groupId \<string\>* (required) – The new database ID of the group you want
associated with the (identified or anonymous) user.

*traits \<Object\>* – A map of attributes about the group. These are
completely at your discretion but common ones include employees and
website. The following traits are reserved and have standardized meaning:

- `address` \<Object\>
- `avatar` \<string\>
- `createdAt` \<Date\>
- `description` \<string\>
- `email` \<string\>
- `employees` \<string\>
- `id` \<string\>
- `industry` \<string\>
- `name` \<string\>
- `phone` \<string\>
- `website` \<string\>

*options \<Object\>* – A map of [common
fields](https://segment.com/docs/spec/common/#structure). This can be
used to selectively enable or disable certain integrations or set
`anonymousId` or `userId` on an ad-hoc basis.


## Support

We're always around to help. If you run into any issues, want advice or
simply have a question, please [open an
issue](https://github.com/rangle/redux-segment/issues/new).


## License

Code and documentation copyright 2015-2016 Rangle.io. Code released
under the [MIT license](./LICENSE). Docs released under Creative Commons.
