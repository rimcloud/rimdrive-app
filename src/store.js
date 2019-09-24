import { createStore, applyMiddleware, compose } from 'redux';
import modules from './modules';

import ReduxThunk from 'redux-thunk';
import loggerMiddleware from './lib/loggerMiddleware';

// const customizedPromiseMiddleware = promiseMiddleware({
//     promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
// });

// const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(modules, composeEnhancers(
    applyMiddleware(loggerMiddleware, ReduxThunk)
));

export default store;
