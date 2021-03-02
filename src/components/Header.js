import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
class Header extends Component {

  renderLoggedMenu = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if((user!==null || this.props.user!=null) && user.role==="ADMIN"){
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
    else if((user!==null || this.props.user!=null) && user.role==="USER"){
      return (
        <li className="tv-drop-menu">
        <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">{user.name} | {user.walley}₺<i className="fa fa-angle-down" /></a>
        <ul className="dropdown-menu tv-sub-menu" role="menu">
        <li className><Link to="/sit_table" className="tv-menu" data-toggle="dropdown">Masaya Otur ve Sipariş Ver</Link></li>
        </ul>
      </li>
      )
    }
    else{
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
function mapStateToProps(state){
  return {
    user:state.userReducer
  }
}
export default connect(mapStateToProps,null)(Header)
