import {createStore, applyMiddleware, compose} from 'redux';
import logger from './configure-logger';
const thunk = require('redux-thunk');
import reducer from '../reducers/index';

const reduxSegment = require('redux-segment');
const tracker = reduxSegment.createTracker();

let middleware: Array<any> = [thunk, logger, tracker];

const finalCreateStore = compose(
  applyMiddleware(...middleware)
)(createStore);

export default () => {
  return finalCreateStore(reducer);
}
