import initialState from './initialState.js'
import * as actionTypes from '../actions/actionTypes'
export default function (state=initialState.user,action){
    
switch(action.type){
    case actionTypes.setUser :
        return action.payload
    case actionTypes.decreaseWallet :
        state.wallet = state.wallet - action.payload
        return {...state}
    case actionTypes.increaseWallet :
        state.wallet = state.wallet + action.payload
        return {...state}
    case actionTypes.setReceipt :
        return {...state,receipt : action.payload}
    default:
        return state
}


}