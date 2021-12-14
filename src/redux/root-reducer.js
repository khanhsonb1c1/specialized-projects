import { combineReducers } from 'redux';
import customerReducer from './reducer/customer.reducers';

const rootReducer = combineReducers({
    customerReducer,
});

export default rootReducer;