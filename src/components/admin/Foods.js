import React, { Component } from 'react'
import { Modal, Loader, Alert } from 'rsuite'
import renderError from '../../helper/renderError'
import apiURL from '../apiURL'

export default class Foods extends Component {

    state = {
        categories: null,
        foods:null,
        modal: false,
        addResponse: null,
        food: { foodName: null, category: null, price: null },
        file: null
    }

    componentDidMount() {
        this.getFoods();
    }
    

    getCategories = () => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_categories", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ categories: data }))
            .catch(res => console.log(res))
    }

    getFoods = () => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_foods", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => res.json())
        .then(data=>this.setState({foods:data}))
        .catch(res=>console.log(res))
    }

    addfood = (e) => {
        e.preventDefault();
        const { food, file } = this.state;
        const token = sessionStorage.getItem("token");
        //form data oluşturuldu. İçerisine food nesnesi json olarak, file ise file olarak yerleştirildi.Headerda content-type kullanmadık.
        const data = new FormData();
        data.append('food',
            new Blob([JSON.stringify(food)], {
                type: 'application/json'
            }));
        data.append("file", file);

        fetch(apiURL + "admin/add_food", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token
            },
            body: data
        }).then(res => {
            if (res.status === 200 || res.status === 201) return res.json()
            else throw new Error();
        }).then(data => {
            if (data.status == null) {
                this.setState({ addResponse: { status: "false", errors: data.errors } })
            } else if (data.status == "false") {
                this.setState({ addResponse: { status: data.status, errors: [data.error] } })
            } else {
                this.setState({ addResponse: { status: data.status, message: data.message } });
                this.getFoods();
            }
        }).catch(res => { Alert.error("Yemek eklenemedi. Daha sonra tekrar deneyin.") })

    }

    deleteFood = foodId =>{
        const { foods } = this.state;
        const token = sessionStorage.getItem("token");
        fetch(apiURL+"admin/delete_food/"+foodId,{
            method : "DELETE",
            headers : {
                Authorization : "Bearer " + token
            }
        }).then(res=>{
            if (res.status===200) return res.json()
            else throw new Error();
        }).then(data => {
            this.setState({foods:this.state.foods.filter(food=>food.id!==foodId)})
            Alert.success(data.message);
        }).catch(res=> Alert.error("Yemek silinemedi. Daha sonra tekrar deneyin."));
    }

    modalStatus = () => { this.setState({ modal: !this.state.modal, food: { foodName: null, category: null, price: null }, addResponse: null }); setTimeout(this.getCategories, 1000) }

    changedInput = (e) => {
        const { food } = this.state;
        this.setState({ food: { ...food, [e.target.name]: e.target.value } })
    }

    changedFile = (e) => {
        const { file } = this.state;
        this.setState({ file: e.target.files[0] })
    }

    renderFoods = () => { 
        const { foods } = this.state;
        if (foods !== null) {
            return (
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#Id</th>
                            <th scope="col">Yemek Fotoğrafı</th>
                            <th scope="col">Yemek İsmi</th>
                            <th scope="col">Fiyat</th>
                            <th scope="col">Kategori</th>
                            <th scope="col">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((food) =>
                        (
                            <tr key={food.id}>
                                <th scope="row">{food.id}</th>
                                <td><img src={apiURL+"files/"+food.image} style={{with:"50px",height:"50px"}}></img></td>
                                <td>{food.foodName}</td>
                                <td>{food.price} ₺</td>
                                <td>{food.category.name}</td>
                                <td><button type="button" onClick={()=>this.deleteFood(food.id)} className="btn btn-danger">Yemeği Sil</button>
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

    renderModalContent = () => {
        const { addResponse, categories } = this.state;
        if (categories != null) {
            return (
                <div>
                    {addResponse !== null ? renderError(addResponse) : null}
                    <input type="text" name="foodName" onChange={this.changedInput} className="form-control" placeholder="Yemek ismi girin..." /><br />
                    <input type="number" name="price" onChange={this.changedInput} className="form-control" placeholder="Yemek fiyatı girin (₺)" /><br />
                    <label>Kategori :</label><br />
                    <select className="form-select" onChange={this.changedInput} name="category">
                        <option key="seç">--Kategori seçin--</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select><br /><br />
                    <input className="form-control" onChange={this.changedFile} required type="file"></input>
                </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />)
        }
    }

    renderModal = () => {
        const { modal, categories } = this.state;
        return (
            <Modal show={modal} onHide={this.modalStatus}>
                <form onSubmit={this.addfood}>
                    <Modal.Header>
                        <Modal.Title>Yemek Ekle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderModalContent()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className=" btn btn-mod btn-border-black btn-large btn-round" disabled={categories === null ? true : false}>Yemek Ekle</button>
                    </Modal.Footer>
                </form>
            </Modal>)
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <button onClick={this.modalStatus} className=" btn btn-mod btn-border-black btn-medium btn-circle">Yemek Ekle</button>
                {this.renderModal()}
                {this.renderFoods()}
            </div>
        )
    }
}
