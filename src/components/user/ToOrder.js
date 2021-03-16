import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Button, Loader, Modal, InputGroup, InputNumber, Alert, Pagination } from 'rsuite'
import { RiShoppingBasketLine } from 'react-icons/ri'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../redux/actions/basketActions'
import * as userActions from '../../redux/actions/userActions'
import { withRouter } from 'react-router-dom'

class ToOrder extends Component {

    state = {
        modalStatus: false,
        categories: null,
        foods: null,
        selectedCategory: null,
        selectedItem: null,
        itemCount: 1,
        activePage: null,
        totalPages: null

    }

    componentDidMount() {
        this.isSitting();
        setTimeout(() => this.getAllFoodsFetch(), 1000);
        setTimeout(() => this.getAllCategories(), 1000);
    }

    isSitting = () => {
        const { history } = this.props;
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/is_sitting", {
            headers: { Authorization: 'Bearer ' + token }
        }).then(res => {
            if (res.status !== 200) history.push('/sit_table')
        })
    }


    getAllCategories = () => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
        }).then(res => res.json()).then(data => {
            this.setState({ categories: data })
        }).catch(res => { console.log(res) })
    }

    getAllFoods = () => {
        this.setState({ selectedCategory: null, foods: null }) //loading efekti için state'teki bilgileri null yapıyorum
        setTimeout(this.getAllFoodsFetch, 1000)
    }

    getAllFoodsFetch = (activePage = 1) => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/all_foods?page=" + activePage, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                const { content, totalPages } = data;
                this.setState({ foods: content, totalPages, activePage })
            })
            .catch(res => console.log(res))
    }

    getFoodsByCategory = (categoryId,activePage=1) => {
        // id'ye göre yiyecekler çekiliyor
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/foods/" + categoryId +"?page="+activePage, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                const {content,totalPages} = data;
                this.setState({ foods: content,totalPages,activePage })}      
                )
            .catch(res => console.log(res))
    }

    changedSelectedCategory = (category) => {
        // seçili kategori değiştiğinde önce yiyecekler boşaltılıyor daha sonra istek atılıyor. Son olarak seçilen kategori state'e yazılıyor.
        this.setState({ foods: null })
        setTimeout(() => this.getFoodsByCategory(category.id), 1000);
        this.setState({ selectedCategory: category })
    }

    selectItem = (food) => {

        this.setState({ modalStatus: true, selectedItem: food })
    }

    addBasket = () => {
        // açılan modal'dan evet butonuna tıklanırsa sepete ekleme işlemi yapılır. Aynı zamanda bakiye düzenlenir. Eğer yeterli değilse sepete eklenmez ve
        // user bilgisi düzenlenmez.
        const { selectedItem, itemCount } = this.state;
        const { actions, user } = this.props;
        if (user.wallet < selectedItem.price * itemCount) {
            Alert.error("Bakiyeniz yeterli değildir, lütfen yükleme yapınız.")
        } else {
            actions.addFood({ ...selectedItem, count: itemCount })
            actions.decreaseWallet(selectedItem.price * itemCount)
            this.setState({ modalStatus: false, selectedItem: null, itemCount: 1 })
        }

    }

    closeModal = () => { this.setState({ modalStatus: false, selectedItem: null, itemCount: 1 }) }

    renderModal = () => {
        const { selectedItem } = this.state;
        /** evet butonuna art arda tıklanırsa state boşaldığı için hata veriyor bunu engellemek için disabled veriliyor. */
        return (
            <Modal show={this.state.modalStatus} onHide={this.closeModal}>
                <Modal.Header>
                    <Modal.Title>Sepete Ekle</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <InputGroup>
                        <InputGroup.Button onClick={() => { this.setState({ itemCount: this.state.itemCount <= 1 ? 1 : this.state.itemCount - 1 }) }}>-</InputGroup.Button>
                        <InputNumber
                            className={'custom-input-number'}
                            value={this.state.itemCount}
                            max={99}
                            min={1}
                        />
                        <InputGroup.Button onClick={() => { this.setState({ itemCount: this.state.itemCount + 1 }) }}>+</InputGroup.Button>
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.addBasket} appearance="primary" disabled={selectedItem === null ? true : null}>

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
                <Button key={999} className=" btn btn-mod btn-border btn-medium btn-circle" onClick={() => { this.setState({selectedCategory:null}); this.getAllFoods() }} > Tümü</Button>
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

    handleSelect = (activePage) => {
        const {selectedCategory} = this.state;
        if(selectedCategory ===null) this.getAllFoodsFetch(activePage);
        else this.getFoodsByCategory(selectedCategory.id,activePage);
        this.setState({activePage});
    }

    renderFoods = () => {
        const { foods } = this.state;

        if (foods !== null) {
            return (
                <div>
            <div className="foods">
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
                                    <span><span class="badge badge-pill badge-success background-info">{food.price} ₺</span></span>
                                    <p>Kategori : {food.category.name}</p>
                                    <span><Button onClick={() => this.selectItem(food)}><RiShoppingBasketLine /> Sepete Ekle</Button></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                }
               <br/>
                
            </div>
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

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <div className="categoryButtonsDiv">
                    {this.renderCategories()}
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="tv-menu-feautre text-center">
                        <h4>{this.state.selectedCategory !== null ? this.state.selectedCategory.name : "Tüm Yiyecekler "}</h4>
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
        user: state.userReducer,
        basket: state.basketReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            addFood: bindActionCreators(basketActions.addFood, dispatch),
            decreaseWallet: bindActionCreators(userActions.decWallet, dispatch)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToOrder))