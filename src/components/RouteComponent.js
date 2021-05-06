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
import addReservation from './user/addReservation';
import myReservations from './user/myReservations';
import NotFound from './NotFound';
import Comments from './admin/Comments';

class RouteComponent extends Component {

    renderLoginPath = () => {
        const token = sessionStorage.getItem("token");
        const {user} = this.props;
        const routes = [];
        if (token !== null && user.role.role === "ADMIN") { //eğer token varsa ve kullanıcı admin ise ulaşılabilecek routelar burada döner.
   
                routes.push(<Route exact path="/tables" component={Tables}/>)
                routes.push(<Route exact path="/categories" component={Categories}/>)
                routes.push(<Route exact path="/foods" component={Foods}/>)
                routes.push(<Route exact path="/comments" component={Comments}></Route>)

        } else if (token !== null && user.role.role === "USER") { //eğer token varsa ve kullanıcı user ise ulaşılabilecek routelar burada döner.
           
            routes.push(<Route exact path="/sit_table" component={SitTable}/>);
            routes.push(<Route exact path="/add_money" component={AddMoney}/> )
            routes.push(<Route exact path="/to_order" component={ToOrder}/>)
            routes.push(<Route exact path="/complete_order" component={CompleteOrder}/>)
            routes.push(<Route exact path="/my_orders" component={MyOrders}/>)
            routes.push(<Route exact path="/get_off_thetable" component={GetOffTheTable}/>)
            routes.push(<Route exact path="/my_receipts" component={MyReceipts}/>)
            routes.push(<Route exact path="/food/:id" component={FoodDetails} />)
            routes.push(<Route exact path="/add_reservation" component={addReservation} />)
            routes.push(<Route exact path="/my_reservations" component={myReservations} />)
  
        }
        else {
            return null;
        }
        return routes;
    }
   
    render() {
    
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Homepage}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    {this.renderLoginPath()}
                    <Route component={NotFound}></Route>
                </Switch>

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
