import { act } from 'react-dom/test-utils';
import * as actionTypes from '../actions/actionTypes'
import initialState from './initialState'

export default function (state=initialState.basket,action) {
    switch (action.type){
        case actionTypes.addFood :
            let index = state.findIndex(food => food.id === action.payload.id);
            if(index!==-1){
               state[index] = {...state[index],count:state[index].count+action.payload.count}
               return state;
            }else{
                state.push(action.payload)
                return state;
            }    
        
        case actionTypes.removeFood : 
            return state.filter(food => food.id != action.payload.id)
        default : return state
    }
}