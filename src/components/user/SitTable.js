import React, { Component } from 'react'
import apiURL from '../apiURL'

import { Alert, Button, Loader, Message } from 'rsuite'
import {TiTick} from 'react-icons/ti'
import { withRouter } from 'react-router-dom';
import { MdNavigateNext } from 'react-icons/md';

import turkishDateFormat from '../../helper/turkishDateFormat'
class SitTable extends Component {

  state = {
    tables: null,
    selectedTable: null,
    nextReservation: null,
    nextReservationError: null
  }

  componentDidMount() {
    this.isSitting();
  }

  isSitting = () => {
    const { history } = this.props;
    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/is_sitting", {
      headers: { Authorization: 'Bearer ' + token }
    }).then(res => {
      if (res.status === 200) history.push('/to_order');
      else this.checkReservation();
    })
  }

  checkReservation = () => {
    const { history } = this.props;
    const token = sessionStorage.getItem("token");
    fetch(apiURL+"user/check_reservation",{
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res=>{
      if(res.status===200) return res.json();
      else throw new Error();
    })
    .then(data=>{
      if (data.status === false) {Alert(data.error); setTimeout(this.getAllTables, 800);}
      else {Alert.success(data.message); history.push("/to_order")}
    })
    .catch(err=>{setTimeout(this.getAllTables, 800);})
  }

  getAllTables = () => {
    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/all_tables", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
    }).then(res => res.json()).then(data => {
      this.setState({ tables: data })
    }).catch(res => { console.log(res) })
  }

  getFirstReservationBySelectedTable = (id) => {
    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/find_firstreservation?tableId=" + id, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.reservation) this.setState({ nextReservation: data.reservation })
        else if (data.status === false) this.setState({ nextReservationError: data.error })
      })
      .catch(err => Alert.error("Sıradaki rezervasyon getirilirken bir hata oluştu"));
  }


  sitTable = () => {
    const { selectedTable } = this.state;
    const { history } = this.props;
    const token = sessionStorage.getItem("token");

    fetch(apiURL + "user/sit_table", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ tableName: selectedTable })
    }).then(res => {
      if (res.status == 200) return res.json();
      else throw new Error();
    }).then(data => {
      if (data.status === false) {
        Alert.error(data.error);
      } else if (data.status === true) {
        Alert.success(data.message)
        history.push('/to_order')
      }
    }).catch(res => Alert.error("Masaya oturamadınız. Daha sonra tekrar deneyin."))

  }

  selectTable = (table) => {
    this.setState({ nextReservation: null, nextReservationError: null })
    this.setState({ selectedTable: table.tableName }, ()=>{setTimeout(() => this.getFirstReservationBySelectedTable(table.id), 500);});
  }

  renderTables = () => {
    const { tables, selectedTable } = this.state;
    if (tables !== null) {
      return (
        <div>
          <Message
            showIcon
            type="info"
            title="Önemli Bilgilendirme"
            description={
              <div>
                <p>Seçtiğiniz masanın sıradaki rezervasyon zamanını öğrenip ona göre masalara oturmanız gerekmektedir.</p>
                <p>Rezervasyonuna 10 dakika kalan masalara oturum gerçekleştiremeyeceksiniz</p></div>
            } />
          <h3>Lütfen oturmak istediğiniz masayı seçin :</h3><br />
          <table className="grid">
            <tbody>
              <tr>
                {tables.map(table =>
                  <td className={table.user !== null ? 'reserved' : 'available'}
                    style={table.tableName === selectedTable ? { background: "orange" } : null}
                    key={table.id} onClick={table.user === null ? () => this.selectTable(table) : null}>
                    <img src="https://cdn0.iconfinder.com/data/icons/hotel-and-restaurant-cool-vector-3/128/136-512.png"></img>
                    {table.tableName}
                  </td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return (<Loader center content="Lütfen bekleyin..." />)
    }
  }

  renderNextButton = () => {
    const ButtonJSX = (<div className="nextButton">
      <Button color="green" onClick={this.sitTable}><MdNavigateNext /> Otur ve Devam Et</Button>
    </div>);
    
    const { nextReservation, nextReservationError } = this.state;
    if (nextReservation === null && nextReservationError !== null) {
        return ButtonJSX;
    }
    else if (nextReservation!==null && nextReservationError === null) {
      const diffTime = Math.abs(new Date(nextReservation.startTime) - new Date());
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      if(diffMinutes > 0 && diffMinutes <= 10) return;
      else return ButtonJSX;
    }
  }

  renderReservationOrError = () => {
    const { nextReservation, nextReservationError,tables } = this.state;
    if (nextReservation !== null) {
      return (
        <center>
          <div className="alert alert-info" style={{width:"60%"}} role="alert">
         Sıradaki Rezervasyon : {turkishDateFormat(new Date(nextReservation.startTime))} | {turkishDateFormat(new Date(nextReservation.endTime))}
           </div>
        </center>
      )
    } else if (nextReservationError !== null) {
      return (
     <center><div className="alert alert-success" style={{width:"40%"}} role="alert"><TiTick/> {nextReservationError}</div></center>
      )
    }else{
      if(tables !== null){
        return (
          <center><div className="alert alert-success" style={{width:"40%"}} role="alert">Seçim Bekleniyor... <Loader/></div></center>
           )
      }
    }
  }

  render() {
    return (
      <div className="container" style={{ marginTop: "10%" }}>
        {this.renderTables()}
        <br />
        {this.renderReservationOrError()}
        <br />
        {this.renderNextButton()}
        <br/>
      </div>
    )
  }
}



export default withRouter(SitTable)
