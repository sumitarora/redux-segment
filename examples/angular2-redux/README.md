# Angular2 Redux Segment

Sample application using:-
* Angular2
* Typescript
* Redux
* Webpack
* Redux Segment

## Building and Serving

* Replace the `__API_KEY__` in `index.html` with valid Segment.io API Key
* Build the application by running the `npm install` command.
* Serve the application by running the `npm start` command.

Based on: https://github.com/rangle/angular2-redux-starter

## Commands

* `npm install`: install npm dependencies specified in package.json as well as typings specified in tsd.json (typings will be put into *typings* folder which is also git ignored).
* `postinstall`: runs automatically after `npm install` and triggers a `npm run build` to provide a build directory to `npm start` by default

* `npm run dev`: will start webpack's development server (with live reloading) on [http://localhost:8080](http://localhost:8080). Note that in this case the bundle will be generated in memory and your bundle in *dist* might get out of sync.
* `npm start`: starts a production server serving the *dist* directory on [http://localhost:3000](http://localhost:3000)

* `npm run build`: bundle all of the application including js/css/html files, with index.html generated according to a template specified in *index.html* (Everything will be put into *dist* folder).
* `npm test`: will run the unit tests for the project as specified in *karma.conf.js* (everything ending in .test.ts will ge picked up, refer to *src/tests.entry.ts* if other extensions should be used).
* `npm run e2e`: will run the e2e suite for this project located in *e2e* (refer to *wdio.conf.js* and *gulpfile.js* for more info, this is the only `gulp` dependency).
* `npm run typings`: removes existing typings located in *typings* directory, reinstalls them based on *tsd.json*, and links whatever is available in *node_modules* (using `tsd link`).
