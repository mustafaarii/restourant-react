import React, { Component } from 'react'
import { Loader, Alert,Modal,Button,Message } from 'rsuite'

import apiURL from '../apiURL'
import turkishDateFormat from '../../helper/turkishDateFormat'
import { connect } from 'react-redux'
import * as userActions from '../../redux/actions/userActions'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'

class GetOffTheTable extends Component {

    state = {
        show : false,
        receipt : {id:null,totalPrice:null,date:null}
    }

    componentDidMount() {
      setTimeout(this.getOffTheTable,500);
    }

    getOffTheTable = async () => {

        /** Öncelikle masada oturuyor mu diye kontrol et eğer oturuyorsa true oturmuyorsa false dönecektir. 
         * Buna göre yönlendir veya istek yap */

        const { history } = this.props;
        const token = sessionStorage.getItem("token");
        let status;
        status = await this.isSitting().then(data => data);
        if (status === 404) {
            Alert.error("Henüz bir masada oturmuyorsunuz.")
            history.push("/");
        } else {
            fetch(apiURL + "user/getoff_thetable", {
                method: "GET",
                headers: { Authorization: 'Bearer ' + token }
            })
                .then(res => {
                    if (res.status === 200) return res.json();
                    else throw res.json();
                })
                .then(data => {
                    this.setState({receipt:data.receipt},()=>{this.changeModalStatus()})
                    
                })
                .catch(err => {
                    err.then(err => { Alert.error(err.error) })
                })
        }
    }

    isSitting = () => {
        const token = sessionStorage.getItem("token");
        const status = fetch(apiURL + "user/is_sitting", {
            headers: { Authorization: 'Bearer ' + token }
        }).then(res => res.status).then(res => res);
        return status;
    }

    changeModalStatus = () => {
        const {show} = this.state;
        this.setState({show:!show})
    }

    close=() => {
        const { history } = this.props;
        history.push("/");
    }

    render() {
        const {show,receipt} = this.state;
       
        return (
            <div>
                <Loader center content="İşleminiz gerçekleştiriliyor, lütfen bekleyin..." />

                <Modal size="lg" show={show} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Fiş Bilgileriniz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
            <Message
      type="success"
      title="Yine Bekleriz"
      description={
          <div>
              <hr/>
          <h6>Fiş Numarası : {receipt.id}</h6>
          <h6>Fiş Tarihi : {turkishDateFormat(new Date(receipt.date))}</h6>
          <h6>Ödenen Fiyat : {receipt.totalPrice} ₺</h6>
          <br/>
        <p>İşleminiz başarıyla gerçekleştirildi. Fiş bilgileriniz kaydedildi.<br/> Daha önceki alışverişlerinizi görebilmek için <b>"Önceki Fişlerim"</b> menüsüne bakabilirsiniz.</p>
        </div>
      }
    />
          </center>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close} appearance="primary">
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            setReceipt: bindActionCreators(userActions.setReceipt, dispatch)
        }
    }
}

export default connect(null, mapDispatchToProps)(withRouter(GetOffTheTable))
