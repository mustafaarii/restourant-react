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

class RouteComponent extends Component {

    renderLoginPath = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if ((user !== null || this.props.user != null) && user.role === "ADMIN") {
            return (
                <Switch>
                    <Route exact path="/tables"><Tables /></Route>
                    <Route exact path="/categories"><Categories /></Route>
                    <Route exact path="/foods"><Foods /></Route>
                </Switch>
            )
        } else if ((user !== null || this.props.user != null) && user.role === "USER") {
            return (
                <Switch>
                    <Route exact path="/sit_table"> <SitTable /> </Route>
                    <Route exact path="/to_order"><ToOrder/></Route>
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
