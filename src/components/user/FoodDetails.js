import React, { Component } from 'react'
import {Alert, Loader,Button,Badge} from 'rsuite'
import {FaShoppingBasket} from 'react-icons/fa'
import {BiSend} from 'react-icons/bi'

import apiURL from '../apiURL'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../redux/actions/basketActions'
class FoodDetails extends Component {

    state = {
        food: null
    }

    componentDidMount() {
        setTimeout(() => this.getFood(), 1000);
    }
    
    getFood = () => {
        const id = this.props.match.params.id;
        const token = sessionStorage.getItem("token");

        fetch(apiURL+"user/food/"+id,{
            headers : {
                "Content-Type" : "application/json",
                Authorization : "Bearer " + token
            }
        })
        .then(res=>{
            if(res.status===200) return res.json();
            else throw new Error();
        })
        .then(food=>this.setState({food}))
        .catch(err=>Alert.error("Aradığınız yiyecek bulunamadı.."));
    }

    getButtonColor = () => {
        //rastgele buton rengi döner.

       const colors = ["red","orange","yellow","green","cyan","blue","violet"];
        return colors[Math.floor(Math.random() * 7)]
    }

    addBasket = (food) => {
        const {actions} = this.props;
        const basketItem = {...food,count:1};
        actions.addBasket(basketItem);
    }

    renderFoodDetail = () => {
        const { food } = this.state;
        if (food !== null) {
            return (
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="tv-section-title">
                            <span>Yemek Hakkında</span>
                            <h2><Badge content={food.price+ "₺"}>{food.foodName}</Badge></h2>
                        </div>
                        <div className="tv-about-info">
                            <p>{food.price} ₺</p>
                            <p>Eğer bu yemeği beğendiyseniz aşağıdaki butona tıklayarak sepetinize ekleyebilirsiniz. İlgili yorumlar aşağıdadır.</p>
                            <Button color={this.getButtonColor()} onClick = {()=>{this.addBasket(food)}}><FaShoppingBasket/> Sepete Ekle</Button>
                        </div>
                 <hr/>
                 <div class="form-group">
                                    <label for="exampleFormControlTextarea1">Bir yorum yazın...</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <Button color="red" style={{float:"right"}} ><BiSend/> Gönder</Button>
                    </div>
                    
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="tv-about-img">
                            <img src={apiURL+"files/"+food.image} style={{width:"400px",height:"400px"}} className="img-responsive tv-img-border-effect" />
                        </div>
                    </div>
                </div>
            )
        }else{
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    renderComments = () => {
        return (
            <div className="container d-flex justify-content-center mt-100 mb-100">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Son Yorumlar</h4>
                  </div>
                  <div className="comment-widgets m-b-20">
                    <div className="d-flex flex-row comment-row">
                      <div className="p-2"><span className="round"><img src="https://i.imgur.com/uIgDDDd.jpg" alt="user" width={50} /></span></div>
                      <div className="comment-text w-100">
                        <h5>Samso Nagaro</h5>
                        <div className="comment-footer"> <span className="date">April 14, 2019</span> <span className="label label-info">Pending</span> <span className="action-icons"> <a href="#" data-abc="true"><i className="fa fa-pencil" /></a> <a href="#" data-abc="true"><i className="fa fa-rotate-right" /></a> <a href="#" data-abc="true"><i className="fa fa-heart" /></a> </span> </div>
                        <p className="m-b-5 m-t-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it</p>
                      </div>
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                {this.renderFoodDetail()}
                {this.renderComments()}
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions : {
            addBasket : bindActionCreators(basketActions.addFood,dispatch)
        }
    }
}
export default connect(null,mapDispatchToProps)(FoodDetails)