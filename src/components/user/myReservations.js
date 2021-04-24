import React, { Component } from 'react'
import { Panel, Alert, Loader, Button, Icon, Notification, ButtonToolbar } from 'rsuite'
import apiURL from '../apiURL'
import turkishDateFormat from '../../helper/turkishDateFormat'

export default class myReservations extends Component {

  state = {
    reservations: null
  }

  componentDidMount() {
    this.deleteOldReservations();
  }

  deleteOldReservations = () => {
    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/delete_old_reservations", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(res=>{setTimeout(() => this.getReservations(), 1000);})
  }
  getReservations = () => {
    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/my_reservations", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ reservations: data }))
      .catch(err => Alert.error("Rezervasyonlarınız getirilirken bir hata oluştu"))
  }

  deleteReservation = (id) => {
    const token = sessionStorage.getItem("token");
    const {reservations} = this.state;

    fetch(apiURL+"user/delete_reservation?id="+id,{
      headers : {
        Authorization : "Bearer " + token
      }
    })
    .then(res=>res.json())
    .then(data => {
      if(data.status === "false") Alert.error(data.error);
      else if(data.status === "true"){
        const newArr = reservations.filter(res=>res.id!=id)
        this.setState({reservations:newArr},()=>{Alert.success(data.message)})
      }
    })
    .catch(err=>Alert.error("Rezervasyon silinirken bir hata oluştu."));
  }

  renderDeleteNotification = (reservation) => {
    return (
      Notification.open({
        title: 'Uyarı',
        duration: 10000,
        description: (
          <div>
            <p><b>{reservation.table.tableName}</b>'daki <b>{reservation.id}</b> numaralı rezervasyonunuzu iptal edeceksiniz. Devam etmek istiyor musunuz ? </p><br/>
            <ButtonToolbar>
              <Button color="green"
                onClick={() => {
                  this.deleteReservation(reservation.id);
                  Notification.close();
                }}
              >
                Sil ve Devam Et
              </Button>
              <Button color="red"
                onClick={() => {
                  Notification.close();
                }}
              >
                İptal
              </Button>
            </ButtonToolbar>
          </div>
        )
      })
    )
  }

  renderReservations = () => {
    const { reservations } = this.state;
    if (reservations === null) {
      return (<Loader center content="Rezervasyonlar getiriliyor,lütfen bekleyin..."></Loader>)
    } else if (reservations.length === 0) {
      return (
        <div className="alert alert-danger">
          Sistemde hiçbir rezervasyonunuz bulunmamaktadır.
        </div>
      )
    }
    else {
    return reservations.map(reservation => (
        <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 300, height:530, margin : "10px" }}>
          <img src="https://image.flaticon.com/icons/png/512/1476/1476897.png" height="200" width="300" />
          <Panel header={reservation.table.tableName}>
            <small>Rezervasyon Numarası : <b style={{float:"right"}}>{reservation.id}</b></small><hr/>
            <small>Başlangıç : <b style={{float:"right"}}>{turkishDateFormat(new Date(reservation.startTime))}</b></small><hr/>
            <small>Bitiş :     <b style={{float:"right"}}>{turkishDateFormat(new Date(reservation.endTime))}</b></small>
            <div><hr/>
            <Button onClick={()=>{this.renderDeleteNotification(reservation)}} size="lg" color="red" style={{float:"right"}}><Icon icon="ban"/> Rezervasyonu İptal Et</Button>
            </div>
          </Panel>
        </Panel>
      ))
    }
  }
  render() {

    return (
      <div className="container" style={{ marginTop: "10%" }}>
      {this.renderReservations()}        
      </div>
    )
  }
}
