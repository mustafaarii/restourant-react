import React, { Component } from 'react'
import apiURL from '../apiURL'
import { Loader } from 'rsuite'
import { withRouter } from 'react-router-dom';

class SitTable extends Component {

  state = {
    tables: null,
    selectedTable: null,
  }

  componentDidMount() {
    setTimeout(this.getAllTables, 1000);
  }


  getAllTables = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetch(apiURL + "user/all_tables", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token
      },
    }).then(res => res.json()).then(data => {
      this.setState({ tables: data })
    }).catch(res => { console.log(res) })
  }

  selectTable = (table) => {
    this.setState({ selectedTable: table.tableName });
  }

  sitTable = () => {
    const {history} = this.props;
    history.push('/next')
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
    const {history} = this.props;

    if (selectedTable !== null) {
      return (<div className="nextButton">
        <a className=" btn btn-mod btn-white btn-small btn-round" onClick={this.sitTable}>Otur ve Devam Et</a>
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
