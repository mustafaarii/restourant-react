import React, { Component } from 'react'
import {
    Switch,
    Route,
} from "react-router-dom";
import Register from './Register';
import Login from './Login'
import Tables from './admin/Tables';
import Categories from './admin/Categories'
import { connect } from 'react-redux'
import Homepage from './Homepage';
import Foods from './admin/Foods';
import SitTable from './user/SitTable';
import ToOrder from './user/ToOrder';
import CompleteOrder from './user/CompleteOrder';
import MyOrders from './user/MyOrders';
import AddMoney from './user/AddMoney';
import GetOffTheTable from './user/GetOffTheTable';
import MyReceipts from './user/MyReceipts';
import FoodDetails from './user/FoodDetails';

class RouteComponent extends Component {

    renderLoginPath = () => {
        const token = sessionStorage.getItem("token");
        const {user} = this.props;

        if (token !== null && user.role.role === "ADMIN") { //eğer token varsa ve kullanıcı admin ise ulaşılabilecek routelar burada döner.
            return (
                <Switch>
                    <Route exact path="/tables" component={Tables}/>
                    <Route exact path="/categories" component={Categories}/>
                    <Route exact path="/foods" component={Foods}/>
                </Switch>
            )
        } else if (token !== null && user.role.role === "USER") { //eğer token varsa ve kullanıcı user ise ulaşılabilecek routelar burada döner.
            return (
                <Switch>
                    <Route exact path="/sit_table" component={SitTable}/>
                    <Route exact path="/add_money" component={AddMoney}/> 
                    <Route exact path="/to_order" component={ToOrder}/>
                    <Route exact path="/complete_order" component={CompleteOrder}/>
                    <Route exact path="/my_orders" component={MyOrders}/>
                    <Route exact path="/get_off_thetable" component={GetOffTheTable}/>
                    <Route exact path="/my_receipts" component={MyReceipts}/>
                    <Route exact path="/food/:id" component={FoodDetails} />
                </Switch>)
        }
        else {
            return null;
        }

    }
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Homepage}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                </Switch>
                {this.renderLoginPath()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer
    }
}

export default connect(mapStateToProps)(RouteComponent);
