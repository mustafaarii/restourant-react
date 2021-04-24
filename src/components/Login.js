import React, { Component } from 'react'
import apiURL from './apiURL'
import {Alert} from 'rsuite'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../redux/actions/userActions'
import { withRouter } from 'react-router-dom'

class Login extends Component {

    state ={
        email:null,
        password:null,

    }

    inputChange=(e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value});
     
    }

    formSubmit = (e) => {
        e.preventDefault();
        const url = apiURL+'login'
        const {email,password} = this.state;
        const {history} = this.props;
        fetch(url,{
            method :"POST",
            headers: {
            'Content-Type': 'application/json',
        },
            body:JSON.stringify({username:email,password:password})
        })
        .then(
          res => {
            if(res.status == 403){ throw new Error();}
           else if(res.status == 200){ return res.json(); } }
        ).then(data=>{
          sessionStorage.setItem("token",data.token)
          this.props.actions.setUser();
          Alert.success("Başarıyla giriş yaptınız.")
          history.push("/")
        }).catch(err => {Alert.error("Kullanıcı adı veya şifre yanlış.")})
      
    }


    render() {
        return (
            <div>
      <div className="container" style={{marginTop:"5%"}}>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="tv-box-inner-head"><h2>Giriş Yap</h2></div>
            <form onSubmit={this.formSubmit} className="elements-form-fields">
              
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Mail Adresiniz</label>
                <input type="email" className="form-control" onChange={this.inputChange} name="email" placeholder="mail@gmail.com" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Şifreniz</label>
                <input type="password" className="form-control" onChange={this.inputChange} name="password" />
              </div>
            
              <button className="btn btn-mod btn-black btn-large btn-circle" type="submit">Giriş Yap</button>
            </form>
          </div>
        </div>
      </div>
            </div>
        )
    }


}

function mapStateToProps(state){
  return {
    user:state.userReducer
  }
}
function  mapDispatchToProps(dispatch) {
  return {
    actions:{
      setUser:bindActionCreators(userActions.setUser,dispatch)
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Login));
