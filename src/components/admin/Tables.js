import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Modal, Loader, Alert,Pagination } from 'rsuite';
import renderError from '../../helper/renderError';

export default class Tables extends Component {

    state = {
        tables: null,
        modal: false,
        addResponse: null,
        tableName: null,
        activePage:null,
        totalPages:null
    }

    componentDidMount() {
        setTimeout(() => {
            this.getTables();
        }, 500);
    }

    getTables = (activePage=1) => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/tables?page="+activePage, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
        }).then(res => res.json()).then(data => {
            const {content,totalPages} = data;
            this.setState({ tables: content,activePage,totalPages });
        }).catch(res => Alert.error("Bir hata oluştu, Daha sonra tekrar deneyin."))
    }

    addTable = (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        const {tableName} = this.state;
        fetch(apiURL + "admin/add_table", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body:JSON.stringify({tableName:tableName})
        }).then(res => {
            if (res.status === 200 || res.status===201) return res.json();
            else throw new Error();
        }).then(data => {
            if (data.table) {
                const {tables,activePage,totalPages} = this.state;
                this.setState({ addResponse: { status: "true", message: "Masa başarıyla eklendi." } });
               if(activePage===totalPages) this.setState({tables : [...tables,data.table]})
            }else{
                if (data.status == null) {
                    this.setState({ addResponse: { status: "false", errors: data.errors } })
                } else if (data.status == "false") {
                    this.setState({ addResponse: { status: data.status, errors: [data.error] } },()=>{console.log(data.error)})
                }
            }
            
        }).catch(res=>{Alert.error("Masa eklenemedi. Daha sonra tekrar deneyin.")})
    }

    deleteTable = tableId => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL+"admin/delete_table/"+tableId,{
            method:"DELETE",
            headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if(res.status===200) return res.json()
            else throw new Error();
        }).then(data => {
            this.setState({tables:this.state.tables.filter(table=>table.id!==tableId)})
            Alert.success(data.message);
        })
        .catch(res => Alert.error("Masa silinemedi. Daha sonra tekrar deneyin."))
    }


    modalStatus = () => { this.setState({ modal: !this.state.modal,tableName:null,addResponse:null }) }

    handleSelect = (activePage) => {
        this.getTables(activePage);
    }

    renderTables = () => {
        const { tables } = this.state;
        if (tables !== null) {
            return (
                <div>
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#Id</th>
                            <th scope="col">Masa İsmi</th>
                            <th scope="col">Durum</th>
                            <th scope="col">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) =>
                        (
                            <tr key={table.id}>
                                <th scope="row">{table.id}</th>
                                <td>{table.tableName}</td>
                                <td>{table.user == null ? "Boş" : "Dolu"}</td>
                                <td><button type="button" className="btn btn-danger" onClick={()=>{this.deleteTable(table.id)}}>Masayı Sil</button>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
                <center>
                <Pagination
          prev
          last
          next
          first
          size="lg"
          pages={this.state.totalPages}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}
        />
        </center>
                </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    renderModal = () => {
        const {addResponse,modal} = this.state;
        return (
            <Modal show={modal} onHide={this.modalStatus}>
                <form onSubmit={this.addTable}>
                    <Modal.Header>
                        <Modal.Title>Masa Ekle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {addResponse!==null ? renderError(addResponse) : null}
                        <label>Masa İsmi</label>
                        <input type="text" name="tablename" onChange={e => { this.setState({ tableName: e.target.value }) }} className="form-control" placeholder="Masa ismi girin..." />

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className=" btn btn-mod btn-border-black btn-large btn-round">Masa Ekle</button>
                    </Modal.Footer>
                </form>
            </Modal>)
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <button onClick={this.modalStatus} className=" btn btn-mod btn-border-black btn-medium btn-circle">Masa Ekle</button>
                {this.renderTables()}
                {this.renderModal()}

            </div>
        )
    }
}
