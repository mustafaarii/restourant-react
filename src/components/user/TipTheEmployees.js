import React, { Component } from 'react'
import apiURL from '../apiURL'
import renderError from '../../helper/renderError'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../../redux/actions/userActions'

import { Button, Loader, Message } from 'rsuite'
class TipTheEmployees extends Component {
    state = {
        employees: null,
        response: null,
        inputValues : {}
    }

    componentDidMount() {
        setTimeout(this.getAllEmployees, 800);
    }


    getAllEmployees = () => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_employees", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ employees: data }))
    }
    
    tipTheEmployee = e => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        const {inputValues} = this.state;
        inputValues.price = parseInt(inputValues.price);
        
        if (Object.keys(inputValues).length<=1) {
            this.setState({response:{status:"false",errors:["Lütfen tüm alanları doldurun."]}})
            return;
        }
        fetch(apiURL+"user/tip/"+inputValues.employeeId,{
            method:"POST",
            headers:{
                Authorization : "Bearer "+token,
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({tip:inputValues.price})
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.status==="true") {
                const {employees} = this.state;
                const index = employees.findIndex(emp=>emp.id===parseInt(inputValues.employeeId))
                employees[index].totalTip+=inputValues.price;
                
                this.props.actions.decreaseWallet(inputValues.price);
                this.setState({response:data,employees})
            }else if(data.status==="false"){
                this.setState({response:{status:data.status,errors:[data.error]}});
            }
            
        })
    }

    inputsOnChanged = e => {
        const {inputValues} = this.state;
        this.setState({inputValues:{...inputValues,[e.target.name]:e.target.value}})
    }

    renderForm = () => {
        const { employees } = this.state;
        if (employees !== null) {
            return (
                <div>
                    <form onSubmit={this.tipTheEmployee}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Çalışan</label>
                            <select name="employeeId" className="form-control" onChange={this.inputsOnChanged}>
                                <option>--Çalışan Seçin--</option>
                                {
                                    employees.map(employee => (
                                        <option value={employee.id}>{employee.name}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Bahşiş Miktarı</label>
                            <select name="price" className="form-control" onChange={this.inputsOnChanged}>
                                <option>--Bahşiş Seçin--</option>
                                <option value="3">3₺</option>
                                <option value="5">5₺</option>
                                <option value="10">10₺</option>
                                <option value="20">20₺</option>
                                <option value="40">40₺</option>
                            </select>
                        </div>
                        <Button color="green" type="submit">Bahşiş Ver</Button>
                    </form>
                </div>
            )
        } else {
            return (<Loader center content="Yükleniyor, lütfen bekleyin..."></Loader>)
        }
    }

    renderEmployees = () => {
        const { employees } = this.state;

        if (employees === null) {
            return;
        } else if (employees.length === 0) {
            return (
                <div>
                    <br />
                    <Message type="error" description="Sisteme hiç çalışan eklenmemiş." />
                </div>
            )
        } else {
            return employees.map(employee => (
                <div className="employee">
                    <center><img draggable="false" src="https://uxwing.com/wp-content/themes/uxwing/download/01-user_interface/find-employee.png" width="50px" height="50px"></img><br />
                        {employee.name}<br />
                        <b>{employee.totalTip} ₺</b></center>
                </div>
            ))
        }
    }

    render() {
        const { response } = this.state;
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ marginBottom: "10%" }}>Çalışanlara Bahşiş Ver</h5>
                        {response !== null ? renderError(response) : null}
                        {this.renderForm()}
                    </div>
                    <div className="col-md-6">
                        <h6>Çalışan Bilgileri</h6><br />
                        <div className="alert alert-primary" role="alert">
                            Çalışan bilgileri ve toplam bahşiş miktarları aşağıdaki gibidir.
                        </div>
                        <div className="employees">
                            {this.renderEmployees()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            decreaseWallet : bindActionCreators(userActions.decWallet,dispatch)
        }
    }
}

export default connect(null,mapDispatchToProps)(TipTheEmployees);