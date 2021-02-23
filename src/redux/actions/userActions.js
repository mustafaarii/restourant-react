import * as actionTypes from './actionTypes'

export function setUser(user){
    return {
        type: actionTypes.setUser,
        payload : user
    }
}