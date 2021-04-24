import React, { Component } from 'react'
import {FaSpinner} from 'react-icons/fa'
export default class NotFound extends Component {

    render() {
        return (
             <div className="mainbox">
      <div className="err">4</div>
        <FaSpinner className="far fa-spin" />
        <div className="err2">4</div>
        <center><div className="msg">Aradığınız sayfa bulunamadı. Lütfen doğru adrese gittiğinizden emin olun.</div></center>
      </div>
        )
    }
}
