import React, { Component } from 'react'
import apiURL from '../apiURL'
import renderError from '../../helper/renderError'
import { Pagination, Loader, Modal, Button, Icon, Alert, ButtonToolbar, Notification } from 'rsuite'
export default class Employees extends Component {

    state = {
        employees: null,
        activePage: null,
        totalPages: null,
        show: false,
        employeeName: "",
        addResponse: null,
    }

    componentDidMount() {
        setTimeout(this.getEmployees, 1000);
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
        const { employeeName } = this.state;
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "admin/add_employee", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: employeeName })
        })
            .then(res => res.json())
            .then(data => {
               this.setState({addResponse:data});
               if(data.status===true) this.getEmployees();
            })
            .catch(err => Alert.error("İşleminiz gerçekleştirilemedi, daha sonra tekrar deneyin."))
    }

    deleteEmployee = id => {
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "admin/delete_employee?id=" + id, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === true) {
                    this.setState({ employees: this.state.employees.filter(employee => employee.id !== id) })
                    Alert.success(data.message);
                } else if (data.status === false) {
                    Alert.error(data.error);
                }
            })
            .catch(err => Alert.error("İşleminiz gerçekleştirilemedi, daha sonra tekrar deneyin."))
    }

    resetTotalTip = id => {
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "admin/reset_totaltip?id=" + id, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === true) {
                    Alert.success(data.message);
                    this.getEmployees();
                } else if (data.status === false) {
                    Alert.error(data.error);
                }
            })
            .catch(err => Alert.error("İşleminiz gerçekleştirilemedi, daha sonra tekrar deneyin."))
    }

    handleSelect = (activePage) => {
        this.getEmployees(activePage);
    }

    showModal = () => { this.setState({ show: true }) }
    closeModal = () => { this.setState({ show: false, addResponse: null }) }
    changedInput = e => { this.setState({ employeeName: e.target.value }) }

    renderNotification = (operation, employeeId) => {
        let message, func = () => { };
        if (operation === 1) {
            message = "Gerçekten çalışanı silmek istiyor musunuz ?";
            func = () => { this.deleteEmployee(employeeId); Notification.close() };
        }
        else if (operation === 2) {
            message = "Çalışanın bahşişini sıfırlamak istediğinize emin misiniz ?";
            func = () => {this.resetTotalTip(employeeId); Notification.close()}
        }
        else return false;

        Notification.open({
            title: 'İşleminizi Onaylayın',
            duration: 10000,
            description: (
                <div>
                    <p>{message}</p>
                    <ButtonToolbar>
                        <Button
                            onClick={func}
                        >
                            Evet
                  </Button>
                        <Button
                            onClick={() => {
                                Notification.close();
                            }}
                        >
                            İptal
                  </Button>
                    </ButtonToolbar>
                </div>
            )
        });
    }

    renderModal = () => {
        const { show, addResponse } = this.state;
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
                    <center><h3>Çalışanlar</h3></center><br />
                    <button onClick={this.modalStatus} className=" btn btn-mod btn-border-black btn-medium btn-circle" onClick={this.showModal}>Çalışan Ekle</button><br />
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
                                        <button type="button" className="btn btn-danger" onClick={() => { this.renderNotification(1, employee.id) }}>Çalışanı Sil</button>{" "}
                                        <button type="button" className="btn btn-danger" onClick={() => { this.renderNotification(2, employee.id) }}>Bahşişi Sıfırla</button>
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
