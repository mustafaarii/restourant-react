import React, { Component } from 'react'

import {Button} from 'rsuite'
import { AiFillBackward } from 'react-icons/ai'
import {CgMathMinus,CgMathPlus} from 'react-icons/cg'
import { FaShoppingBasket,FaTrashAlt,FaCreditCard } from 'react-icons/fa'
import {Alert} from 'rsuite'

import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import { withRouter } from 'react-router-dom'
import * as basketActions from '../../redux/actions/basketActions'
import * as userActions from '../../redux/actions/userActions'
import apiURL from '../apiURL'
class CompleteOrder extends Component {

    state = {
        totalPrice:null
    }

    componentDidMount() {
        this.calculateTotalPrice();
    }
    
    calculateTotalPrice = () => {
        const {basket} = this.props;
        let totalPrice=0;
        basket.forEach(food => {
            totalPrice += food.price * food.count
        });
        this.setState({totalPrice})
    }

    changeTotalPrice = (price) => {
        const {totalPrice} = this.state;
        this.setState({totalPrice:totalPrice+price})
    }

    increaseFoodCount = (food) => {
        const {actions,user} = this.props;
        if (user.wallet<food.price) {
            Alert.error("Bakiyeniz yeterli değildir, lütfen yükleme yapınız.")
        }else{ 
        actions.changeFoodCount(food.id,1);
        actions.decreaseWallet(food.price);
        this.changeTotalPrice(food.price)
        // yiyeceğin sayısı arttırılır. kullanıcının parasından çekilir. totalPrice güncellenir.
        }
    }

    decreaseFoodCount = (food) => {
        const {actions} = this.props;
        if (food.count === 1) {
            Alert.error("Yiyecek sayısı daha fazla azaltılamaz.")
        }else{
            actions.changeFoodCount(food.id,-1);
            actions.increaseWallet(food.price);
            this.changeTotalPrice(-food.price)
            // yiyeceğin sayısı azaltılır. kullanıcının parası iade edilir. totalPrice güncellenir.
        }
    }

    removeFromBasket = (food) => {
        const {actions} = this.props;
        const price = food.price*food.count;
        actions.removeFood(food);
        actions.increaseWallet(price);
        this.changeTotalPrice(-price);
        // yiyecek sepetten kaldırılır. kullanıcının parası iade edilir. totalPrice state'i güncellenir.
    }

    completeOrder = () => {
        const token = sessionStorage.getItem("token");
        const {basket,actions} = this.props;
        let orders = [];

        basket.forEach(food=>{
            orders.push({foodId:food.id,count:food.count});
        })

        fetch(apiURL+"user/to_order",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : "Bearer "+token
            },
            body : JSON.stringify(orders)
        }).then(res=>{
            if(res.status===200) return res.json();
            if(res.status!==200) throw new Error();
        }).then(data=>{
            if (data.status === true) {Alert.success(data.message); actions.clearBasket();}
            else Alert.error(data.error);
        }).catch(res=>Alert.error("İşleminiz gerçekleştirilemedi. Daha sonra tekrar deneyin."))
    }

    renderPanel = () => {
        const { basket,history } = this.props;
        const {totalPrice} = this.state;
        if (basket.length !== 0) {
            return (
                <div className="panel panel-danger">
                    <div className="panel-heading">
                        <div className="panel-title">
                            <div className="row">
                                <div className="col-xs-10">
                                    <h5><span className="glyphicon glyphicon-shopping-cart" /> Sipariş Sepetiniz </h5>
                                </div>
                                <div className="col-xs-2">
                                    <button type="button" className="btn btn-primary btn-sm btn-block" onClick={()=>{history.push("/to_order")}}>
                                        <AiFillBackward /> Siparişe Dön
                            </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        {
                            basket.map(food => (
                                <div key={food.id}>
                                    <div className="row">
                                        <div className="col-xs-2"><img className="img-responsive" src={apiURL + "files/" + food.image}/>
                                        </div>
                                        <div className="col-xs-4">
                                            <h4 className="product-name"><strong>{food.foodName}</strong></h4><h4><small>{food.category.name}</small></h4>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="col-xs-5 text-right">
                                                <h6><strong>{food.price} <span className="text-muted">₺</span></strong></h6>
                                            </div>
                                            <div className="col-xs-3">
                                            <span className="badge badge-secondary">{food.count} Adet</span>
                                            </div>
                                            <div className="col-xs-4">
                                                <Button color="blue" onClick={()=>this.decreaseFoodCount(food)}><CgMathMinus/></Button> &nbsp;
                                                <Button color="green" onClick={()=>this.increaseFoodCount(food)}><CgMathPlus/></Button> &nbsp;
                                                <Button color="red" onClick={()=>this.removeFromBasket(food)}><FaTrashAlt/></Button> 
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        }

                        
                    </div>
                    <div className="panel-footer">
                        <div className="row text-center">
                            <div className="col-xs-9">
                                <div className="text-right"><h6>Toplam :</h6> <h4><strong>{totalPrice} ₺</strong></h4></div>
                            </div>
                            <div className="col-xs-3">
                                <button type="button" onClick={this.completeOrder} className="btn btn-success btn-block">
                                <FaCreditCard />  Siparişi Tamamla
                          </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div className="alert alert-danger" style={{ width: "50%",height:"120px", marginLeft: "25%" }} role="alert">
                <FaShoppingBasket />  Sepetiniz boş.<br /> Siparişi tamamlamak için lütfen sepete bir şeyler ekleyiniz.
                <Button style={{float:"right"}} onClick={()=>history.push("/to_order")}>Geri Dön</Button>
            </div>)
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                {this.renderPanel()}
            </div>
        )
    }

}


function mapStateToProps(state) {
    return {
        basket: state.basketReducer,
        user : state.userReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions:{
            changeFoodCount : bindActionCreators(basketActions.changeFoodCount,dispatch),
            decreaseWallet : bindActionCreators(userActions.decWallet,dispatch),
            increaseWallet : bindActionCreators(userActions.incWallet,dispatch),
            removeFood: bindActionCreators(basketActions.removeFood, dispatch),
            clearBasket : bindActionCreators(basketActions.clearBasket,dispatch)

        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(CompleteOrder))
