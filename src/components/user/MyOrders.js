import React, { Component } from 'react'
import { Loader } from 'rsuite'

import apiURL from '../apiURL'

export default class MyOrders extends Component {

    state = {
        orders: null,
        totalPrice : null
    }

    componentDidMount() {
        setTimeout(this.getMyOrders, 1000);
    }
    
    calculateTotalPrice = () => {
        const {orders} = this.state;
        let total = 0;
        orders.forEach(order => {
            total += order.food.price * order.count;
        });
        this.setState({totalPrice:total})
    }

    getMyOrders = () => {
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "user/get_orders", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => res.json()).then(data => this.setState({ orders: data },()=>{this.calculateTotalPrice()}))
    }

    renderTable = () => {
        const { orders,totalPrice } = this.state;
        if (orders === null) {
            return (<Loader center content="Lütfen bekleyin..." />)
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
                    {orders.map(order=>(
                        <tr>
                        <th scope="row">{order.id}</th>
                        <td>{order.food.foodName}</td>
                        <td>{order.food.price}</td>
                        <td>{order.count}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <hr/>
            <h4 style={{float:"right"}}>Toplam Ödenen Fiyat: {totalPrice} ₺</h4>
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
