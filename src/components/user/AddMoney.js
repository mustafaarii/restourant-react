import React, { Component } from 'react'
import { Button, Notification, ButtonToolbar, Alert } from 'rsuite'
import { FaMoneyBillWave,FaCreativeCommonsZero } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'

import apiURL from '../apiURL'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../redux/actions/userActions'
class AddMoney extends Component {

    state = {
        selectedMoney: 0,
        selectType: true
    }

    changeSelectType = () => {
        const { selectType } = this.state;
        this.setState({ selectType: !selectType })
    }

    changeSelectMoney = (money) => {
        const { selectType, selectedMoney } = this.state;
        if (money < 0) return false;
        if (selectType === true) {
            this.setState({ selectedMoney: selectedMoney + money })
        } else {
            if (selectedMoney - money < 0) this.setState({ selectedMoney: 0 });
            else this.setState({ selectedMoney: selectedMoney - money })
        }
    }

    addMoney = () => {
        const { selectedMoney } = this.state;
        const { actions } = this.props;
        const token = sessionStorage.getItem('token');

        if (selectedMoney===0) {
            Alert.error("Lütfen önce bakiye seçiniz.");
            Notification.close();
        }else{
            fetch(apiURL + 'user/add_money', {
                method: "POST",
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: selectedMoney
            }).then(res => {
                if (res.status === 200) return res.json();
                else throw new Error();
            }).then(data => {
                if (data.status === true) {
                    actions.increaseWallet(selectedMoney);
                    this.setState({ selectedMoney: 0 });
                    Alert.success(data.message);
                    Notification.close();
                }
                else Alert.error(data.error);
            }).catch(err => { Alert.error("İşleminiz gerçekleştirilemedi. Daha sonra tekrar deneyin.") })
        }


    }

    renderAlerts = () => {
        const { selectType } = this.state;
        if (selectType === true) {
            return (
                <center>
                    <div style={{ width: "100px" }} className="alert alert-success" role="alert">
                        Arttır
                    </div>
                </center>
            )
        } else {
            return (
                <center>
                    <div style={{ width: "100px" }} className="alert alert-danger" role="alert">
                        Azalt
             </div>
                </center>
            )
        }
    }

    renderConfirm = () => {
        Notification.open({
            title: 'Bakiye Yükleme',
            duration: 10000,
            description: (
                <div>
                    <p>Seçtiğiniz bakiyeyi yüklemek istiyor musunuz ?</p><br />
                    <ButtonToolbar>
                        <Button
                            onClick={() => {
                                this.addMoney();
                            }}
                        >
                            Yükle
                  </Button>
                        <Button
                            onClick={() => {
                                Notification.close();
                            }}
                        >
                            İptal
                  </Button>
                    </ButtonToolbar>
                </div>
            )
        });
    }

    renderMoneyBox = () => {
        return (
            <div className="moneybuttons">
                <Button size="lg" style={{ width: "80px", height: "80px" }} onClick={() => { this.changeSelectMoney(5) }} color="green"><FaMoneyBillWave /> 5 ₺</Button>
                <Button size="lg" style={{ width: "80px", height: "80px" }} onClick={() => { this.changeSelectMoney(10) }} color="green"><FaMoneyBillWave /> 10 ₺</Button>
                <Button size="lg" style={{ width: "80px", height: "80px" }} onClick={() => { this.changeSelectMoney(20) }} color="green"><FaMoneyBillWave /> 20 ₺</Button>
                <Button size="lg" style={{ width: "80px", height: "80px" }} onClick={() => { this.changeSelectMoney(50) }} color="green"><FaMoneyBillWave /> 50 ₺</Button>
                <Button size="lg" style={{ width: "80px", height: "80px" }} onClick={() => { this.changeSelectMoney(100) }} color="green"><FaMoneyBillWave /> 100 ₺</Button>
            </div>
        )
    }
    renderSwitchButton = () => {
        return (
            <center>
                <div className="toggle" onClick={this.changeSelectType}>
                    <input type="checkbox" className="check" />
                    <b className="b switch" />
                    <b className="b track" />
                </div>
            </center>
        )
    }
    render() {
        const { selectedMoney } = this.state;
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <center><h5>Seçtiğiniz Bakiye : {selectedMoney} ₺</h5></center>
                <br /><br />
                {this.renderMoneyBox()}
                <br /><br />
                {this.renderSwitchButton()}
                <br /><br />
                {this.renderAlerts()}
                <Button style={{ float: "right", marginRight: "5%" }} onClick={() => { this.renderConfirm() }} color="green"><GiReceiveMoney /> Bakiyeyi Yükle</Button>
                <Button style={{ float: "right", marginRight: "5%" }} onClick={() => { this.setState({selectedMoney:0}) }} color="red"><FaCreativeCommonsZero /> Sıfırla</Button>
            </div>

        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            increaseWallet : bindActionCreators(userActions.incWallet,dispatch),
        }
    }
}
export default connect(null, mapDispatchToProps)(AddMoney)
