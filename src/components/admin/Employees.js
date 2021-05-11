import React, { Component } from 'react'
import apiURL from '../apiURL'
import renderError from '../../helper/renderError'
import { Pagination, Loader, Modal, Button, Icon, Alert, ButtonToolbar, Notification } from 'rsuite'
export default class Employees extends Component {

    state={
        employees : null,
        activePage : null,
        totalPages : null,
        show : false,
        employeeName : "",
        addResponse : null,
    }

    componentDidMount() {
        setTimeout( this.getEmployees,1000);
    }
    
    getEmployees = (activePage = 1) => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "admin/all_employees?page=" + activePage, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => { this.setState({ employees: data.content, totalPages: data.totalPages }) })
            .catch(err => console.log(err))
    }

    addEmployee = () => {
        const {employeeName} = this.state;
        const token = sessionStorage.getItem("token");
        
        fetch(apiURL+"admin/add_employee",{
            method : "POST",
            headers : {
                Authorization : "Bearer "+token,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({name:employeeName})
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.status == "false") {
                this.setState({ addResponse: { status: data.status, errors: [data.error] } })
            } else {
                this.setState({ addResponse: { status: data.status, message: data.message } });
                this.getEmployees();
            }
        })
        .catch(err=>Alert.error("İşleminiz gerçekleştirilemedi, daha sonra tekrar deneyin."))
    }

    handleSelect = (activePage) => {
        this.getEmployees(activePage);
    }

    showModal = () => {this.setState({show:true})}
    closeModal = () => {this.setState({show:false,addResponse:null})}
    changedInput = e => {this.setState({employeeName:e.target.value},()=>console.log(this.state.employeeName))}

    renderModal = () => {
        const {show,addResponse} = this.state;
        return (
            <div> 
            <Modal show={show} onHide={this.closeModal}>
          <Modal.Header>
            <Modal.Title>Çalışan Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {addResponse !== null ? renderError(addResponse) : null}
          <input type="text" name="foodName" onChange={this.changedInput} className="form-control" placeholder="Çalışan ismini girin..." /><br />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addEmployee} appearance="primary">
              Ekle
            </Button>
            <Button onClick={this.closeModal} appearance="subtle">
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
            </div>
        )
    }

    renderEmployees = () => {
        const { employees } = this.state;
        if (employees !== null) {
            return (
                <div>
                    <center><h3>Çalışanlar</h3></center><br/>
                    <button onClick={this.modalStatus} className=" btn btn-mod btn-border-black btn-medium btn-circle" onClick={this.showModal}>Çalışan Ekle</button><br/>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#Id</th>
                                <th scope="col">Çalışan İsmi</th>
                                <th scope="col">Kazandığı Bahşiş</th>
                                <th scope="col">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) =>
                            (
                                <tr key={employee.id}>
                                    <th scope="row">{employee.id}</th>
                                    <td>{employee.name}</td>
                                    <td>{employee.totalTip} ₺</td>
                                    <td>
                                        <button type="button" className="btn btn-danger">Çalışanı Sil</button>{" "}
                                        <button type="button" className="btn btn-danger">Bahşişi Sıfırla</button>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                    <center>
                        <Pagination prev last next first size="lg" pages={this.state.totalPages} activePage={this.state.activePage} onSelect={this.handleSelect} />
                    </center>
                </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                {this.renderEmployees()}
                {this.renderModal()}
            </div>
        )
    }
}
