import React, { Component } from 'react'
import { Alert, Loader, Button, Badge,Message } from 'rsuite'
import { FaShoppingBasket } from 'react-icons/fa'
import { BiSend } from 'react-icons/bi'

import apiURL from '../apiURL'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../redux/actions/basketActions'
import * as userActions from '../../redux/actions/userActions'
import turkishDateFormat from '../../helper/turkishDateFormat'
class FoodDetails extends Component {

    state = {
        food: null,
        comment : "",
        comments: null,
        activePage: 1,
        totalPages: null,
        color : null
    }

    componentDidMount() {
        this.getButtonColor();
        setTimeout(() => this.getFood(), 1000);
    }

    getComments = () => {
        const { activePage,comments } = this.state;
        const id = this.props.match.params.id;
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "user/comments/" + id + "?page=" + activePage, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        })
            .then(res => {
                if (res.status === 200) return res.json()
                else throw new Error();
            })
            .then(data => { 
                if(comments===null) this.setState({comments:data.content,totalPages: data.totalPages})
                else this.setState({comments:comments.concat(data.content)})
                this.setState({ activePage: activePage + 1 })
             })
            .catch(err => this.setState({ comments: [] }))
    }

    sendComment = () => {
        const token = sessionStorage.getItem("token");
        const {food,comment,comments} = this.state;
        fetch(apiURL+"user/add_comment",{
            method: "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : "Bearer "+ token
            },
            body : JSON.stringify({foodId:food.id,comment : comment})
        })
        .then(res=>{
            if(res.status===200) return res.json();
            else throw res.json();
        })
        .then(data=>{
            Alert.success("Yorum başarıyla eklendi.");
            this.setState({comments:[data.comment,...comments]})
        })
        .catch(err=>err.then(error=>Alert.error(error.error)))
    }   

    getFood = () => {
        const id = this.props.match.params.id;
        const token = sessionStorage.getItem("token");

        fetch(apiURL + "user/food/" + id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        })
            .then(res => {
                if (res.status === 200) return res.json();
                else throw new Error();
            })
            .then(food => this.setState({ food },this.getComments))
            .catch(err => Alert.error("Aradığınız yiyecek bulunamadı.."));
    }

    getButtonColor = () => {
        //rastgele buton rengi döner.

        const colors = ["red", "orange", "yellow", "green", "cyan", "blue", "violet"];
        this.setState({color : colors[Math.floor(Math.random() * 7)]}) 
    }

    addBasket = (food) => {
        const { actions, user } = this.props;
        const basketItem = { ...food, count: 1 };

        if (user.wallet < basketItem.price) {
            Alert.error("Bakiyeniz yeterli değildir, lütfen yükleme yapınız.")
        } else {
        actions.addBasket(basketItem);
        actions.decWallet(food.price);
        }
    }

    handleChange = (e) => {
        this.setState({comment:e.target.value})
    }

    renderFoodDetail = () => {
        const { food,color } = this.state;
 
        if (food !== null) {
            return (
                <div>
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="tv-section-title">
                            <span>Yemek Hakkında</span>
                            <h2><Badge style={{zIndex : "0"}} content={food.price + "₺"}>{food.foodName}</Badge></h2>
                        </div>
                        <div className="tv-about-info">
                            <p>{food.price} ₺</p>
                            <p>Eğer bu yemeği beğendiyseniz aşağıdaki butona tıklayarak sepetinize ekleyebilirsiniz. İlgili yorumlar aşağıdadır.</p>
                            <Button color={color} onClick={() => { this.addBasket(food) }}><FaShoppingBasket /> Sepete Ekle</Button>
                        </div>
                        <hr />
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Bir yorum yazın...</label>
                            <textarea class="form-control" name="comment" onChange={this.handleChange} id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                        <Button color="red" style={{ float: "right" }} onClick={this.sendComment} ><BiSend /> Gönder</Button>
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="tv-about-img">
                            <img src={apiURL + "files/" + food.image} style={{ width: "400px", height: "400px" }} className="img-responsive tv-img-border-effect" />
                        </div>
                    </div>
                </div>
                <hr/>
                </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    renderMoreButton = () => {
        const {activePage, totalPages} = this.state;
        if (activePage <= totalPages) {
         return (<Button onClick={()=>this.getComments()} appearance='primary' block>Daha Fazla Yorumu Gör</Button>);   
        }else {
            return null
        }
         
    }

    renderComments = () => {
        const { comments } = this.state;
        if (comments===null) {
            return (<div><br/><center><Loader content="Lütfen bekleyin..." /></center></div>)
        }else if (comments.length===0) {
            return (<div style={{marginBottom:"10px"}}><Message type="error" description="Bu yemeğe ait bir yorum bulunamadı.." /></div>)
        }else {
            return (
                <div className="container d-flex justify-content-center mt-100 mb-100">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Son Yorumlar</h4>
                                </div>
                                <div className="comment-widgets m-b-20">
                                    {
                                        comments.map(comment => (
                                            <div className="d-flex flex-row comment-row">
                                                 <div className="comment-text w-100">
                                                    <h5>{comment.user.name}</h5>
                                                    <p className="m-b-5 m-t-10">{comment.comment}</p>
                                                    <br/>
                                                    <div className="comment-footer"> {turkishDateFormat(new Date(comment.date))}</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {this.renderMoreButton()}
                </div>
            )
        }   
    }

    render() {
        const {food} = this.state;
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                {this.renderFoodDetail()}
                {food!== null ? this.renderComments() : null}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user : state.userReducer
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            addBasket: bindActionCreators(basketActions.addFood, dispatch),
            decWallet : bindActionCreators(userActions.decWallet,dispatch)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FoodDetails)