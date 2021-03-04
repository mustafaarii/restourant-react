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

export function changeFoodCount(foodId,count){
    return {
        type:actionTypes.changeFoodCount,
        payload : {foodId:foodId,count:count}
    }
}