import React, { Component } from 'react'
import apiURL from './apiURL'
import renderError from '../helper/renderError'

export default class Register extends Component {

    state ={
        name:null,
        email:null,
        password:null,
        response : null 

    }
    
    renderError = () => {
        const {response} = this.state;
        if(response.status == "false"){
        return (<div className="alert alert-danger" role="alert">
        {response.errors.map( (error,index) => (
               <li key={index} style={{color:"red"}}>{error}</li>
           ))}
        </div>)
        }else if(response.status=="true"){
         return (<div className="alert alert-success" role="alert">
           <li style={{color:"success"}}>{response.message}</li></div>)
        }
    }

    inputChange=(e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value});
     
    }

    formSubmit = (e) => {
        e.preventDefault();
        const url = apiURL+'register'
        const {name,email,password} = this.state;

        fetch(url,{
            method :"POST",
             headers: {
            'Content-Type': 'application/json',
        },
            body:JSON.stringify({name:name,email:email,password:password})
        })
        .then(res=>res.json())
        .then(data => {
            if(data.status==null){
                this.setState({response:{status:"false",errors:data.errors}})
            }else if(data.status=="false"){
                this.setState({response:{status:data.status,errors:[data.error]}})
            }else{
                this.setState({response:{status:data.status,message:data.message}})
            }
        })
        .catch(res=> console.log(res.status))

    }


    render() {
      const {response} = this.state;
        return (
            <div>
      <div className="container" style={{marginTop:"5%"}}>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="tv-box-inner-head"><h2>Kayıt Ol</h2></div>
            {response!=null ? renderError(response):null}
            <form onSubmit={this.formSubmit} className="elements-form-fields">
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">İsminiz</label>
                <input type="text" className="form-control" onChange={this.inputChange} name="name" placeholder="Ahmet Büyük" />
              </div> 
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Mail Adresiniz</label>
                <input type="email" className="form-control" onChange={this.inputChange} name="email" placeholder="mail@gmail.com" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Şifreniz</label>
                <input type="password" className="form-control" onChange={this.inputChange} name="password" />
              </div>
            
              <button className="btn btn-mod btn-black btn-large btn-circle" type="submit">Üye Ol</button>
            </form>
          </div>
        </div>
      </div>
            </div>
        )
    }
}
