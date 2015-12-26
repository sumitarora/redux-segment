function emit(type: string, fields: Array) {
  window.analytics && window.analytics[type](...fields);
}

const EventTypes = {
  page: 'page',
};

function createTracker() {
  return () =>  next => action => handleAction(next, action);
}

function handleAction(next: Function, action: Object) {
  if (action.meta && action.meta.analytics) return handleSpec(next, action);

  return handleActionType(next, action);
}

function extractFields(obj: Object, keys: Array) {
  return keys.map(key => obj[key]);
}

function validatePageFields(fields: Object) {
  if (fields.category && !fields.name) {
    return new Error('missing name field for EventTypes.page');
  }

  return null;
}

function getPageProperties(fields: Object) {
  if (fields.category) return [ 'category', 'name', 'properties' ];
  if (!fields.name) return [ 'properties' ];

  return [ 'name', 'properties' ];
}

function extractPageFields(fields) {
  // all fields are optional for page events
  if (!fields) {
    return [];
  }

  const err = validatePageFields(fields);
  if (err) throw err;

  const props = getPageProperties(fields);

  return extractFields(fields, props);
}

function getFields(type: string, fields: Object) {
  const typeFieldHandlers = {
    [EventTypes.page]: extractPageFields,
  };

  return typeFieldHandlers[type](fields);
}

function getEventType(spec) {
  if (typeof spec === 'string') {
    return spec;
  }

  return spec.eventType;
}

function handleSpec(next: Function, action: Object) {
  const spec = action.meta.analytics;
  const type = getEventType(spec);
  const fields = getFields(type, spec.eventPayload);

  emit(type, fields);

  return next(action);
}

function handleActionType(next: Function, action: Object) {
  switch (action.type) {
    case '@@router/INIT_PATH':
    case '@@router/UPDATE_PATH':
    case '@@reduxReactRouter/initRoutes':
    case '@@reduxReactRouter/routerDidChange':
    case '@@reduxReactRouter/replaceRoutes':
      emit(EventTypes.page);
      return next(action);
    default:
      return next(action);
  }
}


export {
  createTracker,
  EventTypes,
};
