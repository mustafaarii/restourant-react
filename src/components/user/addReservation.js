import React, { Component } from 'react'
import apiURL from '../apiURL'

import renderError from '../../helper/renderError'
import { Loader, Alert, Button,Message } from 'rsuite';
export default class addReservation extends Component {

    state = {
        tables: null,
        formData: { tableId: null, startTime: null, endTime: null },
        response: null,
        fullReservations: null,
    }

    componentDidMount() {
        setTimeout(this.getAllTables, 500);
    }


    getAllTables = () => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_tables", {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => res.json()).then(tables => this.setState({ tables }))
    }

    formOnSubmit = (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        const { formData } = this.state;
        fetch(apiURL + "user/add_reservation", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
           this.setState({response:data})
        }).catch(err => Alert.error("Bir hata oluştu. Daha sonra tekrar deneyin."));
    }


    inputsOnChanged = (e) => {
        const { formData } = this.state;
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ formData: { ...formData, [name]: value } }, () => { this.checkInputAndFetch(name) });

    }

    checkInputAndFetch = (name) => {
       const {formData} = this.state;
       if(formData.tableId === null || formData.startTime === null) return;

       if (name === "startTime" || name==="tableId") {
            const token = sessionStorage.getItem("token");
            const { formData } = this.state;
            let date=null;
            try{
                date = new Date(formData.startTime).toISOString();         
            }catch{
                return;
            }
            fetch(apiURL + "user/search_reservation?startTime=" + date + "&tableId="+ formData.tableId, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then(res => res.json())
                .then(data => this.setState({ fullReservations: data }))
        } else {
            return;
        }
    }

    renderForm = () => {
        const { tables } = this.state;
        if (tables !== null) {
            return (
                <div>
                    <form onSubmit={this.formOnSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Masa</label>
                            <select name="tableId" className="form-control" onChange={this.inputsOnChanged}>
                                <option>--Masa Seçin--</option>
                                {
                                    tables.map(table => (
                                        <option value={table.id}>{table.tableName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="example-datetime-local-input" className="col-2 col-form-label">Başlangıç Saati</label>
                            <div className="col-10">
                                <input name="startTime" className="form-control" type="datetime-local" onChange={this.inputsOnChanged} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="example-datetime-local-input" className="col-2 col-form-label">Bitiş Saati</label>
                            <div className="col-10">
                                <input name="endTime" className="form-control" type="datetime-local" onChange={this.inputsOnChanged} />
                            </div>
                        </div>
                        <Button color="green" type="submit">Rezervasyonu Oluştur</Button>
                    </form>
                </div>
            )
        } else {
            return (<Loader center content="Yükleniyor, lütfen bekleyin..."></Loader>)
        }
    }

    renderSearchedReservation = () => {
        const { fullReservations } = this.state;

        if (fullReservations === null) {
            return;
        } else if (fullReservations.length === 0) {
            return (
                <div>
                    <br/>
                    <Message type="error" description="Seçtiğiniz güne ait bir rezervasyon bulunamadı.." />
                </div>
            )
        } else {
            return fullReservations.map(reservation => (
                <div className="reservation">
                    <span>{reservation.startTime.slice(-8, -3)} - {reservation.endTime.slice(-8, -3)}</span>
                    <p>{reservation.table.tableName}</p>
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
                        <h5 style={{ marginBottom: "10%" }}>Rezervasyon Yap</h5>
                        {response !== null ? renderError(response) : null}
                        {this.renderForm()}
                    </div>
                    <div className="col-md-6">
                    <h6>Seçtiğiniz Günkü Rezervasyonlar</h6>
                        <div className="fullreservations">
                            {this.renderSearchedReservation()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
