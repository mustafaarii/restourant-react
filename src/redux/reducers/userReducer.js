import initialState from './initialState.js'
import * as actionTypes from '../actions/actionTypes'
export default function (state=initialState.user,action){
    
switch(action.type){
    case actionTypes.setUser :
        return action.payload
    case actionTypes.decreaseWalley :
        state.walley = state.walley - action.payload
        return state
    case actionTypes.increaseWalley :
        state.walley = state.walley + action.payload
        return state
    default:
        return state
}


}