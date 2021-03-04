import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Alert, Button, Loader } from 'rsuite'
import { withRouter } from 'react-router-dom';
import { MdNavigateNext } from 'react-icons/md';

class SitTable extends Component {

  state = {
    tables: null,
    selectedTable: null,
  }

  componentDidMount() {
    this.isSitting();
    setTimeout(this.getAllTables, 1000);
  }

  isSitting = () => {
    const { history } = this.props;
    const token = sessionStorage.getItem("token");
    fetch(apiURL+"user/is_sitting",{
     headers : { Authorization : 'Bearer ' + token}
    }).then(res => {
      if(res.status === 200) history.push('/to_order')
    })
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

  selectTable = (table) => {
    this.setState({ selectedTable: table.tableName });
  }

  sitTable = () => {
    const { selectedTable } = this.state;
    const { history } = this.props;
    const token = sessionStorage.getItem("token");
    
    fetch(apiURL + "user/sit_table", {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({tableName : selectedTable})
    }).then(res => {
      if (res.status == 200) return res.json();
      else throw new Error();
    }).then(data => {
      if (data.status === "false") {
        Alert.error(data.error);
      } else if (data.status === "true") {
        Alert.success(data.message)
        history.push('/to_order')
      }
    }).catch(res => Alert.error("Masaya oturamadınız. Daha sonra tekrar deneyin."))
   
  }

  renderTables = () => {
    const { tables, selectedTable } = this.state;
    if (tables !== null) {
      return (
        <div>
          <h3>Lütfen oturmak istediğiniz masayı seçin :</h3><br />
          <table className="grid">
            <tbody>
              <tr>
                {tables.map(table =>
                  <td
                    className={table.user !== null ? 'reserved' : 'available'}
                    style={table.tableName === selectedTable ? { background: "orange" } : null}
                    key={table.id} onClick={table.user === null ? () => this.selectTable(table) : null}>{table.tableName} </td>)}
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
    const { selectedTable } = this.state;
    const { history } = this.props;

    if (selectedTable !== null) {
      return (<div className="nextButton">
        <Button color="green" onClick={this.sitTable}><MdNavigateNext/> Otur ve Devam Et</Button>
      </div>)
    }
    else { return null }
  }


  render() {
    return (
      <div className="container" style={{ marginTop: "10%" }}>
        {this.renderTables()}
        {this.renderNextButton()}
      </div>
    )
  }
}
export default withRouter(SitTable)
