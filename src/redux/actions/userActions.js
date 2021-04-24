import * as actionTypes from './actionTypes'
import apiURL from '../../components/apiURL'

export function setUserSuccess(user){
    return {
        type: actionTypes.setUser,
        payload : user
    }
}

//setUser öncelikle isteği atar gelen datayı success fonksiyonunun parametresine payload için gönderir

export function setUser() {
    return function(dispath) {
        const token = sessionStorage.getItem("token")
        fetch(apiURL+"user/auth",{
            method:"GET",
            headers : {
                Authorization: 'Bearer ' + token
            }
        })
        .then(res=>{
            if(res.status===200) return res.json();
            else throw new Error();
        })
        .then(data=>dispath(setUserSuccess(data)))
        .catch(err=>dispath(setUserSuccess({role:{role:null},email:null,wallet:null,name:null})))
    }
}

export function decWallet(money) {
    return {
        type : actionTypes.decreaseWallet,
        payload : money
    }
}

export function incWallet(money) {
    return {
        type : actionTypes.increaseWallet,
        payload : money
    }
}

export function setReceipt(receiptId) {
    return {
        type: actionTypes.setReceipt,
        payload : receiptId
    }
}