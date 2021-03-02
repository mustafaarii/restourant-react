import * as actionTypes from './actionTypes'

export function addFood(food) {
    return {
        type:actionTypes.addFood,
        payload : food
    }
}

export function removeFood(food){
    return {
        type : actionTypes.removeFood,
        payload : food
    }
}