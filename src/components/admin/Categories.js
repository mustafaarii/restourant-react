import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Modal, Loader, Alert } from 'rsuite';
import renderError from '../../helper/renderError';

export default class Tables extends Component {

    state = {
        categories: null,
        modal: false,
        addResponse: null,
        categoryName: null
    }
    
    componentDidMount() {
        this.getAllCategories();
    }

    getAllCategories = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        fetch(apiURL + "user/all_categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
        }).then(res => res.json()).then(data => {
            this.setState({ categories: data })
        }).catch(res => { console.log(res) })
    }

    addCategory = (e) => {
        e.preventDefault();
        const user = JSON.parse(sessionStorage.getItem("user"));
        const {categoryName} = this.state;
        fetch(apiURL + "admin/add_category", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body:JSON.stringify({name:categoryName})
        }).then(res => {
            if (res.status === 200 || res.status===201) return res.json();
            else  throw new Error();
        }).then(data => {
            if (data.status == null) {
                this.setState({ addResponse: { status: "false", errors: data.errors } })
            } else if (data.status == "false") {
                this.setState({ addResponse: { status: data.status, errors: [data.error] } })
            } else {
                this.setState({ addResponse: { status: data.status, message: data.message } });
                this.getAllCategories();
            }
        }).catch(res=>{Alert.error("Kategori eklenemedi. Daha sonra tekrar deneyin.")})
    }

    deleteCategory = categoryId => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        fetch(apiURL+"admin/delete_category/"+categoryId,{
            method:"DELETE",
            headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Bearer ' + user.token
            }
        }).then(res => {
            if(res.status===200) return res.json()
            else throw new Error();
        }).then(data => {
            this.setState({categories:this.state.categories.filter(category=>category.id!==categoryId)})
            Alert.success(data.message);
        })
        .catch(res => Alert.error("Kategori silinemedi. Daha sonra tekrar deneyin."))
    }


    modalStatus = () => { this.setState({ modal: !this.state.modal,categoryName:null,addResponse:null }) }

    renderCategories = () => {
        const { categories } = this.state;
        if (categories !== null) {
            return (
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#Id</th>
                            <th scope="col">Kategori İsmi</th>
                            <th scope="col">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) =>
                        (
                            <tr key={category.id}>
                                <th scope="row">{category.id}</th>
                                <td>{category.name}</td>
                                <td><button type="button" className="btn btn-danger" onClick={()=>{this.deleteCategory(category.id)}}>Kategoriyi Sil</button>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    renderModal = () => {
        const {addResponse,modal} = this.state;
        return (
            <Modal show={modal} onHide={this.modalStatus}>
                <form onSubmit={this.addCategory}>
                    <Modal.Header>
                        <Modal.Title>Kategori Ekle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {addResponse!==null ? renderError(addResponse) : null}
                        <label>Kategori İsmi</label>
                        <input type="text" name="category_name" onChange={e => { this.setState({ categoryName: e.target.value }) }} className="form-control" placeholder="Kategori ismi girin..." />

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className=" btn btn-mod btn-border-black btn-large btn-round">Kategori Ekle</button>
                    </Modal.Footer>
                </form>
            </Modal>)
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <button onClick={this.modalStatus} className=" btn btn-mod btn-border-black btn-medium btn-circle">Kategori Ekle</button>
                {this.renderCategories()}
                {this.renderModal()}

            </div>
        )
    }
}