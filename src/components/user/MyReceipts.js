import React, { Component } from 'react'
import { Table, Loader,Pagination } from 'rsuite'
import apiURL from '../apiURL'

const { Column, HeaderCell, Cell } = Table;
export default class MyReceipts extends Component {

  state = {
    receipts: [],
    totalPages: null,
    activePage: 1
  }

  componentDidMount() {
    this.getMyReceipts();
  }

  getMyReceipts = (activePage = 1) => {

    const token = sessionStorage.getItem("token");
    fetch(apiURL + "user/my_receipts?page=" + activePage, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    }).then(res => res.json()).then(data => this.setState({ receipts: data.content, activePage, totalPages: data.totalPages }));
  }

  handleSelect = (activePage) => {
      this.getMyReceipts(activePage);
  }

  renderTable = () => {
    const { receipts } = this.state;
    if (receipts.length !== 0) {
      return (
        <div>
          <Table
            virtualized
            height={400}
            data={receipts}
            style={{ zIndex: "0" }}
            
          >
            <Column width={150} align="center">
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={200}>
              <HeaderCell>Tarih</HeaderCell>
              <Cell dataKey="date" />
            </Column>

            <Column width={230}>
              <HeaderCell>Toplam Ödenen Fiyat</HeaderCell>
              <Cell dataKey="totalPrice" />
            </Column>
          </Table>
          <hr />
          <Pagination
            prev
            last
            next
            first
            size="lg"
            pages={this.state.totalPages}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </div> )

        } else {
      return (<Loader center content="İşleminiz gerçekleştiriliyor, lütfen bekleyin..." />)
    }
  }

  render() {
    const { receipts } = this.state;
    return (
      <div className="container" style={{ marginTop: "10%" }}>
        {this.renderTable()}
      </div>
    )
  }
}
