import React, { Component } from 'react'
import { Alert, Loader } from 'rsuite'
import { connect } from 'react-redux'
import apiURL from '../apiURL'
import { bindActionCreators } from 'redux'
import * as userActions from '../../redux/actions/userActions'
import { withRouter } from 'react-router-dom'

class MyOrders extends Component {

    state = {
        orders: null,
        totalPrice: null
    }

    componentDidMount() {
        setTimeout(this.isSitting, 500);
        setTimeout(this.getMyOrders, 1000);
    }

    calculateTotalPrice = () => {
        const { orders } = this.state;
        let total = 0;
        orders.forEach(order => {
            total += order.food.price * order.count;
        });
        this.setState({ totalPrice: total })
    }

    isSitting = () => {
        const { actions, history } = this.props;
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "user/is_sitting", {
            headers: { Authorization: 'Bearer ' + token }
        }).then(res => {
            if (res.status === 200) return res.json();
            else throw new Error();
        }).then(data => { actions.setReceipt(data) }
        ).catch(err => { Alert.error("Henüz bir masada oturmuyorsunuz."); history.push("/") })
    }

    getMyOrders = () => {
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "user/get_orders", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => res.json()).then(data => this.setState({ orders: data }, () => { this.calculateTotalPrice() }))
    }

    renderTable = () => {
        const { orders, totalPrice } = this.state;
        const { user } = this.props;
        if (orders === null) {
            return (<Loader center content="Lütfen bekleyin..." />)
        } else if (orders.length === 0) {
            return (<div className="alert alert-danger" style={{ width: "30%", marginLeft: "35%" }} role="alert">
                Henüz bir sipariş vermediniz.
            </div>)
        } else {
            return (
                <div>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#Sipariş No</th>
                                <th scope="col">Yemek İsmi</th>
                                <th scope="col">Fiyat</th>
                                <th scope="col">Adet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr>
                                    <th scope="row">{order.id}</th>
                                    <td>{order.food.foodName}</td>
                                    <td>{order.food.price}</td>
                                    <td>{order.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <h4 style={{ float: "left" }}>Fiş No : {user.receipt}</h4>
                    <h4 style={{ float: "right" }}>Toplam Ödenen Fiyat: {totalPrice} ₺</h4>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                {this.renderTable()}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.userReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            setReceipt: bindActionCreators(userActions.setReceipt, dispatch)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyOrders))