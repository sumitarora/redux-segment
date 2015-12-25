/**
 * Create a fake `method` on the provided `stub`.
 *
 * The fake method will use the `stub` as a queue and record the data "sent",
 * prefixed by the `method` name.
 */
const stubMethod = (stub: Array, method: string) => (...args) => {
  args.unshift(method);

  stub.push(args);

  return stub;
};


/**
 * Return an Analytics.js stub
 *
 * Heavily influenced by the stub created during the Analytics.js snippet's
 * initialization before the actual Analytics.js script, itself, is loaded.
 */
export default function createAnalyticsStub() {
  // Based on library reference (https://segment.com/docs/libraries/analytics.js/).
  const methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'page',
    'once',
    'off',
    'on',
  ];

  return methods.reduce((stub, method) => {
    stub[method] = stubMethod(stub, method);

    return stub;
  }, []);
}
