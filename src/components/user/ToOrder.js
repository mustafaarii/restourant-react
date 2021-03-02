import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Button, Loader, Modal,InputGroup,InputNumber } from 'rsuite'
import { RiShoppingBasketLine } from 'react-icons/ri'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../redux/actions/basketActions'
class ToOrder extends Component {

    state = {
        modalStatus: false,
        categories: null,
        foods: null,
        selectedCategory: null,
        selectedItem: null,
        itemCount: 1
    }

    componentDidMount() {
        setTimeout(() => this.getAllFoods(), 1000);
        setTimeout(() => this.getAllCategories(), 1000);
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

    getAllFoods = () => {
        this.setState({ selectedCategory: null })
        const user = JSON.parse(sessionStorage.getItem("user"));
        fetch(apiURL + "user/all_foods", {
            headers: {
                Authorization: "Bearer " + user.token
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ foods: data }))
            .catch(res => console.log(res))
    }

    getFoodsByCategory = (categoryId) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        fetch(apiURL + "user/foods/" + categoryId, {
            headers: {
                Authorization: "Bearer " + user.token
            }
        })
            .then(res => res.json())
            .then(data => this.setState({ foods: data }))
            .catch(res => console.log(res))
    }

    changedSelectedCategory = (category) => {
        this.getFoodsByCategory(category.id)
        this.setState({ selectedCategory: category.name })
    }

    selectItem = (food) => {
        this.setState({ modalStatus: true ,selectedItem: food},()=>{console.log(this.state.selectedItem)})
    }

    addBasket = () => {
        const {selectedItem,itemCount} = this.state;
        this.props.actions.addFood({...selectedItem,count:itemCount})
        this.setState({modalStatus:false,selectedItem:null,itemCount:1},console.log(this.props.basket))
    }

    closeModal = () => {this.setState({modalStatus:false,selectedItem:null,itemCount:1})}

    renderModal = () => {
        return (
            <Modal show={this.state.modalStatus} onHide={this.closeModal}>
                <Modal.Header>
                    <Modal.Title>Sepete Ekle</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <InputGroup>
                        <InputGroup.Button onClick={()=>{this.setState({itemCount:this.state.itemCount <=1 ? 1 : this.state.itemCount-1})}}>-</InputGroup.Button>
                        <InputNumber
                            className={'custom-input-number'}
                            value={this.state.itemCount}
                            max={99}
                            min={1}
                        />
                        <InputGroup.Button onClick={()=>{this.setState({itemCount:this.state.itemCount+1})}}>+</InputGroup.Button>
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.addBasket} appearance="primary">
                        Ekle
              </Button>
                    <Button onClick={this.closeModal} appearance="subtle">
                        İptal
              </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    renderCategories = () => {
        const { categories } = this.state;
        let categoriesJSX = [];
        categoriesJSX.push(
            <div className="categoryButton">
                <Button key={999} className=" btn btn-mod btn-border btn-medium btn-circle" onClick={() => { this.getAllFoods() }}> Tümü</Button>
            </div>
        )
        if (categories !== null) {
            categories.map(category => {
                categoriesJSX.push(
                    <div className="categoryButton">
                        <Button key={category.id} className=" btn btn-mod btn-border btn-medium btn-circle" onClick={() => { this.changedSelectedCategory(category) }}> {category.name}</Button>
                    </div>
                )
            })
            return categoriesJSX;
        } else {

        }
    }

    renderFoods = () => {
        const { foods } = this.state;

        if (foods !== null) {
            return (<div className="foods">
                {
                    foods.map(food => (<div className="tv-menu-block">
                        <div className="row">
                            <div className="col-md-3 col-sm-3 col-xs-12">
                                <div className="tv-menu-img">
                                    <img src={apiURL + "files/" + food.image} style={{ with: "50px", height: "50px" }}></img>
                                </div>
                            </div>
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="tv-menu-title">
                                    <h4>{food.foodName}</h4>
                                    <span>{food.price} ₺</span>
                                    <p>Kategori : {food.category.name}</p>
                                    <span><Button className=" btn btn-success btn-round" onClick={() => this.selectItem(food)}><RiShoppingBasketLine /> Sepete Ekle</Button></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                }
            </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <div className="categoryButtonsDiv">
                    {this.renderCategories()}
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="tv-menu-feautre text-center">
                        <h4>{this.state.selectedCategory !== null ? this.state.selectedCategory : "Tüm Yiyecekler "}</h4>
                    </div>

                </div>
                {this.renderFoods()}
                {this.renderModal()}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        basket: state.basketReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            addFood: bindActionCreators(basketActions.addFood, dispatch)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ToOrder)