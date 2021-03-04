import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiDownArrowAlt, BiTrash, BiBasket, BiCreditCard } from 'react-icons/bi'
import { bindActionCreators } from 'redux';
import * as basketActions from '../redux/actions/basketActions'
import * as userActions from '../redux/actions/userActions'
import apiURL from '../components/apiURL'
import { Button } from 'rsuite';
import { withRouter } from 'react-router-dom';
class Header extends Component {

  removeBasket = (food) => {
    const { actions } = this.props;
    actions.removeFood(food);
    actions.increaseWalley(food.price * food.count)
  }

  renderLoggedMenu = () => {
    const token = sessionStorage.getItem("token");
    const { user } = this.props;
    if (token !== null && user.role.role === "ADMIN") {
      return (
        <li className="tv-drop-menu">
          <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Admin Paneli<i className="fa fa-angle-down" /></a>
          <ul className="dropdown-menu tv-sub-menu" role="menu">
            <li className><Link to="/tables" className="tv-menu" data-toggle="dropdown">Masalar</Link></li>
            <li className><Link to="/categories" className="tv-menu" data-toggle="dropdown">Kategoriler</Link></li>
            <li className><Link to="/foods" className="tv-menu" data-toggle="dropdown">Yemekler</Link></li>
          </ul>
        </li>
      )
    }
    else if (token !== null && user.role.role === "USER") {
      let menuJSX = [];
      const { basket,history } = this.props;

      menuJSX.push(<li className="tv-drop-menu">
        <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">
          {user.name}  {user.walley}₺
        </a>
        <ul className="dropdown-menu tv-sub-menu" role="menu">
          <li className><Link to="/sit_table" className="tv-menu" data-toggle="dropdown">Masaya Otur ve Sipariş Ver</Link></li>
        </ul>
      </li>
      )
      if (basket.length === 0) { //sepet boşsa burada sepet boş yazar değilse sepet elemanları map edilir.
        menuJSX.push(
          <li className="tv-drop-menu">
            <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Sepet <span class="badge badge-pill badge-success background-info">{basket.length}</span> <BiDownArrowAlt /></a>
            <ul className="dropdown-menu tv-sub-menu" role="menu">
              <center className="color-error" style={{ float: "center" }}><BiBasket />Sepet boş</center>
            </ul>
          </li>)
      } else {
        menuJSX.push(
          <li className="tv-drop-menu">
            <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Sepet <span class="badge badge-pill badge-success background-info">{basket.length}</span> <BiDownArrowAlt /></a>
            <ul className="dropdown-menu tv-sub-menu" role="menu">
              {this.props.basket.map(food => (

                <li style={{ width: "400px", padding: "5px" }} >
                  <div className="row">
                    <div className="col-md-2 col-xs-2">
                      <img src={apiURL + "files/" + food.image} className="img-rounded" style={{ with: "30px", height: "30px" }}></img>
                    </div>
                    <div className="col-md-8 col-xs-8">
                      <center>{food.foodName}  <span class="badge badge-pill badge-danger">{food.count} Adet</span></center>
                    </div>
                    <div className="col-md-2 col-xs-2">
                      <Button color="red" onClick={() => { this.removeBasket(food) }}> <BiTrash /></Button>
                    </div>
                  </div>
                  <hr />
                </li>
              ))}
              <Button className="finishOrderButton" onClick={()=>{history.push("/complete_order")}} color="green"><BiCreditCard /> Siparişi Tamamla</Button>
            </ul>
          </li>)
      }
      return menuJSX;
    }
    else {
      return (<li className><Link to="/login" className="tv-menu" data-toggle="dropdown">Giriş Yap</Link></li>);
    }
  }

  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-default navbar-fixed-top tv-navbar-custom">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-sm-12 col-xs-12">
                  <div className="navbar-header text-center">
                    <Link to="/" className="navbar-brand tv-cafe-logo">Restourant</Link>
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#tv-navbar">
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                    </button>
                  </div>
                </div>
                <div className="col-md-8 col-sm-12 col-xs-12">
                  <div className="collapse navbar-collapse" id="tv-navbar">
                    <ul className="nav navbar-nav text-center main-menu">
                      <li className><Link to="/register" className="tv-menu" data-toggle="dropdown">Kayıt Ol</Link></li>
                      {this.renderLoggedMenu()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
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
      removeFood: bindActionCreators(basketActions.removeFood, dispatch),
      increaseWalley: bindActionCreators(userActions.incWalley, dispatch)
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
