import React, { Component } from 'react'
import {Table,Loader} from 'rsuite'
import apiURL from '../apiURL'
import turkishDateFormat from '../../helper/turkishDateFormat'
const { Column, HeaderCell, Cell } = Table;
export default class MyReceipts extends Component {

    state={
        receipts:[],
    }

    componentWillMount() {
        this.getMyReceipts();
    }
    getMyReceipts=() => {
        const token = sessionStorage.getItem("token");

        fetch(apiURL+"user/my_receipts",{
            headers :{
                "Content-Type":"application/json",
                Authorization : "Bearer " + token
            }
        }).then(res=>res.json()).then(data=>this.setState({receipts:data},()=>{console.log(data)}));
    }

    renderTable = () => {
        const {receipts} = this.state;
        if(receipts.length!==0){
           return(
            <Table
            virtualized
            height={400}
            data={receipts}
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
           )
  
        
        }else{
            return (<Loader center content="İşleminiz gerçekleştiriliyor, lütfen bekleyin..." />)
        }
    }
    
    render() {
        const {receipts} = this.state;
        return (
            <div className="container" style={{ marginTop: "10%" }}>
              {this.renderTable()}
            </div>
        )
    }
}
