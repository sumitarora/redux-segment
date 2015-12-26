function emit(type: string) {
  window.analytics && window.analytics[type]();
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

function getEventType(spec) {
  if (typeof spec === 'string') {
    return spec;
  }

  return spec.eventType;
}

function handleSpec(next: Function, action: Object) {
  const spec = action.meta.analytics;
  const type = getEventType(spec);


  emit(type);

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
