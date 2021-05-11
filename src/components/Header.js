import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiDownArrowAlt, BiTrash, BiBasket, BiCreditCard } from 'react-icons/bi'
import { bindActionCreators } from 'redux';
import * as basketActions from '../redux/actions/basketActions'
import * as userActions from '../redux/actions/userActions'
import apiURL from '../components/apiURL'
import { Button, Modal, ButtonToolbar, FormGroup, FormControl, Form, ControlLabel, HelpBlock, Alert } from 'rsuite';
import { withRouter } from 'react-router-dom';
class Header extends Component {

  state = {
    showModal: false,
    comment: "",
    errorMessage: null
  }

  removeBasket = (food) => {
    const { actions } = this.props;
    actions.removeFood(food);
    actions.increaseWallet(food.price * food.count)
  }

  renderLoggedMenu = () => {
    const token = sessionStorage.getItem("token");
    const { user,history } = this.props;
    let menuJSX = [];

    if (token !== null && user.role.role === "ADMIN") {
      menuJSX.push(
        <li className="tv-drop-menu" key="adminMenu">
          <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Admin Paneli<i className="fa fa-angle-down" /></a>
          <ul className="dropdown-menu tv-sub-menu" role="menu">
            <li><Link to="/tables" className="tv-menu" data-toggle="dropdown">Masalar</Link></li>
            <li><Link to="/categories" className="tv-menu" data-toggle="dropdown">Kategoriler</Link></li>
            <li><Link to="/foods" className="tv-menu" data-toggle="dropdown">Yemekler</Link></li>
            <li><Link to="/comments" className="tv-menu" data-toggle="dropdown">Yorumlar</Link></li>
            <li><Link to="/employees" className="tv-menu" data-toggle="dropdown">Çalışanlar</Link></li>
          </ul>
        </li>
      )
      menuJSX.push(
        <li><Link onClick={() => { sessionStorage.removeItem("token"); history.push("/login") }} className="tv-menu" data-toggle="dropdown">Çıkış Yap</Link></li>
      )
      return menuJSX;
    }
    else if (token !== null && user.role.role === "USER") {
      let menuJSX = [];
      const { basket, history } = this.props;

      menuJSX.push(
        <li className="tv-drop-menu" key="userMenu">
          <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">
            {user.name}  {user.wallet}₺
        </a>
          <ul className="dropdown-menu tv-sub-menu" role="menu">
            <li><Link to="/add_money" className="tv-menu" data-toggle="dropdown">Bakiye Yükle</Link></li>
            <li><Link to="/sit_table" className="tv-menu" data-toggle="dropdown">Masaya Otur</Link></li>
            <hr />
            <li><Link to="/add_reservation" className="tv-menu" data-toggle="dropdown">Rezervasyon Yap</Link></li>
            <li><Link to="/my_reservations" className="tv-menu" data-toggle="dropdown">Rezervasyonlarım</Link></li>
            <hr />
            <li><Link to="/to_order" className="tv-menu" data-toggle="dropdown">Sipariş ver</Link></li>
            <li><Link to="/my_orders" className="tv-menu" data-toggle="dropdown">Siparişlerim</Link></li>
            <li><Link to="/my_receipts" className="tv-menu" data-toggle="dropdown">Önceki Fişlerim</Link></li>
            <hr />
            <li><Link to="/get_off_thetable" className="tv-menu" data-toggle="dropdown">Masadan Kalk</Link></li>
          </ul>
        </li>
      )
      if (basket.length === 0) { //sepet boşsa burada sepet boş yazar değilse sepet elemanları map edilir.
        menuJSX.push(
          <li className="tv-drop-menu" key="basketEmpty">
            <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Sepet <span className="badge badge-pill badge-success background-info">{basket.length}</span> <BiDownArrowAlt /></a>
            <ul className="dropdown-menu tv-sub-menu" role="menu">
              <center className="color-error" style={{ float: "center" }}><BiBasket />Sepet boş</center>
            </ul>
          </li>)
      } else {
        menuJSX.push(
          <li className="tv-drop-menu" key="basketNotEmpty">
            <a data-toggle="dropdown" aria-expanded="false" className="tv-menu">Sepet <span className="badge badge-pill badge-success background-info">{basket.length}</span> <BiDownArrowAlt /></a>
            <ul className="dropdown-menu tv-sub-menu" role="menu">
              {this.props.basket.map(food => (
                <li style={{ width: "400px", padding: "5px" }} key={food.id}>
                  <div className="row">
                    <div className="col-md-2 col-xs-2">
                      <img src={apiURL + "files/" + food.image} className="img-rounded" style={{ with: "30px", height: "30px" }}></img>
                    </div>
                    <div className="col-md-8 col-xs-8">
                      <center>{food.foodName}  <span className="badge badge-pill badge-danger">{food.count} Adet</span></center>
                    </div>
                    <div className="col-md-2 col-xs-2">
                      <Button color="red" onClick={() => { this.removeBasket(food) }}> <BiTrash /></Button>
                    </div>
                  </div>
                  <hr />
                </li>
              ))}
              <Button className="finishOrderButton" onClick={() => { history.push("/complete_order") }} color="green"><BiCreditCard /> Siparişi Tamamla</Button>
            </ul>
          </li>)
      }
      menuJSX.push(
        <li key="cikis"><Link onClick={() => { sessionStorage.removeItem("token"); history.push("/login") }} className="tv-menu" data-toggle="dropdown">Çıkış Yap</Link></li>
      )

      menuJSX.push(
        <li key="degerlendirme"><Link onClick={() => { this.open() }} className="tv-menu" data-toggle="dropdown">Bizi Değerlendir</Link></li>
      )

      return menuJSX;
    }
    else {
      return (<li key="giris"><Link to="/login" className="tv-menu" data-toggle="dropdown">Giriş Yap</Link></li>);
    }
  }

  open = () => this.setState({ showModal: true })

  close = () => this.setState({ showModal: false, errorMessage : null })

  inputOnChanged = (text) => {
    if (text.length > 10) this.setState({ errorMessage: null })
    this.setState({ comment: text })
  }

  addComment = () => {
    const token = sessionStorage.getItem("token");
    const { comment } = this.state;

    fetch(apiURL + "user/add_sitecomment", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment: comment })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "false") this.setState({ errorMessage: data.error });
        else if (data.status === "true") {
          Alert.success("Yorumunuz tarafımıza iletildi.")
          this.setState({ showModal: false, comment: "" })
        }
      })
      .catch(err => { console.error(err) })
  }

  renderCommentModal = () => {
    const { showModal, errorMessage } = this.state;
    return (
      <div className="modal-container">
        <ButtonToolbar>
          <Button onClick={this.open}> Open</Button>
        </ButtonToolbar>

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Yorumunu Gönder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <Form>
                <FormGroup>
                  <FormControl
                    onChange={(e) => { this.inputOnChanged(e) }}
                    name="name"
                    componentClass="textarea"
                    errorMessage={errorMessage}
                  />
                  <HelpBlock>Yorumunuzu bu alana girin</HelpBlock>
                </FormGroup>

              </Form>
            </center>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addComment} disabled={errorMessage !== null ? true : false} appearance="primary">
              Yorumu Gönder
            </Button>
            <Button onClick={this.close} appearance="subtle">
              İptal
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
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
                      <li><Link to="/register" className="tv-menu" data-toggle="dropdown">Kayıt Ol</Link></li>
                      {this.renderLoggedMenu()}

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        {this.renderCommentModal()}
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
      increaseWallet: bindActionCreators(userActions.incWallet, dispatch)
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
