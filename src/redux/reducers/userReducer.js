import initialState from './initialState.js'
import * as actionTypes from '../actions/actionTypes'
export default function (state=initialState.user,action){
switch(action.type){
    case actionTypes.setUser :
        return action.payload
    default:
        return state
}


}