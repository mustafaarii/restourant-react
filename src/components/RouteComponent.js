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

class RouteComponent extends Component {

    renderLoginPath = () => {
        const token = sessionStorage.getItem("token");
        const {user} = this.props;

        if (token !== null && user.role.role === "ADMIN") { //eğer token varsa ve kullanıcı admin ise ulaşılabilecek routelar burada döner.
            return (
                <Switch>
                    <Route exact path="/tables"><Tables /></Route>
                    <Route exact path="/categories"><Categories /></Route>
                    <Route exact path="/foods"><Foods /></Route>
                </Switch>
            )
        } else if (token !== null && user.role.role === "USER") { //eğer token varsa ve kullanıcı user ise ulaşılabilecek routelar burada döner.
            return (
                <Switch>
                    <Route exact path="/sit_table"> <SitTable /> </Route>
                    <Route exact path="/to_order"><ToOrder/></Route>
                    <Route exact path="/complete_order"><CompleteOrder/></Route>
                    <Route exact path="/my_orders"><MyOrders/></Route>
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
                    <Route exact path="/"> <Homepage /> </Route>
                    <Route exact path="/register"> <Register /> </Route>
                    <Route exact path="/login"><Login /></Route>
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
