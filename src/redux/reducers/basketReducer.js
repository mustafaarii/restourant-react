import { act } from 'react-dom/test-utils';
import * as actionTypes from '../actions/actionTypes'
import initialState from './initialState'

export default function (state=initialState.basket,action) {
    let index,newState;
    switch (action.type){
        case actionTypes.addFood :
            index = state.findIndex(food => food.id === action.payload.id);
            if(index!==-1){
               state[index] = {...state[index],count:state[index].count+action.payload.count}
            }else{
                state.push(action.payload)
            }
            newState = [...state]
            return newState; // statein referansı değişmediği zaman componentler render edilmiyor. Bu yüzden yeni dizi dönüldü.
        case actionTypes.removeFood : 
            const filteredState = state.filter(food => food.id != action.payload.id)
            return filteredState;
        case actionTypes.changeFoodCount :
            index = state.findIndex(food => food.id === action.payload.foodId)
            state[index] = {...state[index],count:state[index].count+action.payload.count}
            newState = [...state]
            return newState;
        default : return state
    }
}