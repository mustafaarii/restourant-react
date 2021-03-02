import {combineReducers} from 'redux'
import userReducer from './userReducer'
import basketReducer from './basketReducer'
const rootReducer = combineReducers({
    userReducer,basketReducer
});
export default rootReducer;