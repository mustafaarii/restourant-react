import React, { Component } from 'react'

import apiURL from './apiURL'
import turkishDateFormat from '../helper/turkishDateFormat'

export default class Homepage extends Component {

    state ={
      sittingInfos : null
    }

    componentDidMount() {
      this.getSittingTime();
    }
    

    getSittingTime = () => {
      const token = sessionStorage.getItem("token");
      fetch(apiURL+"user/get_sittingtime",{
        headers : {
          Authorization : "Bearer " + token
        }
      })
      .then(res => {
        if(res.status === 200) return res.json()
      })
      .then(data=>this.setState({sittingInfos:data}))
    }

    renderBanner(){
        return (
            <div id="banner">
          <div className="tv-banner-image">
            <div className="tv-welcome-banner">
              <div className="tv-welcome-title">
                <h2>RESTOURANT</h2>
                <p>Online restouran uygulaması</p>
              </div>
            </div>
          </div>
        </div>
        )
    }

    renderSittingInfos =()=>{
      const {sittingInfos} = this.state;
      if (sittingInfos != null) {
        return (
          <div className="tv-clients-banner tv-section-padding-70" style={{background: "black"}}>
            <div className="container">
              <div className="row">
                <div className="tv-clients-info">
                  <p>Kişisel Bilgileriniz</p><br/>
                  <div className="border" />
                </div>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <div className="tv-clients-counter">
                    <p className="counter" data-slno={1} data-min={0} data-max={250} data-delay=".9" data-increment={1}>
                      {Math.floor(sittingInfos.totalMinute / sittingInfos.count)} <small>dk</small></p>
                    <h4>Ortalama Oturma Süresi</h4>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <div className="tv-clients-counter">
                    <p className="counter" data-slno={1} data-min={0} data-max={8648} data-delay=".9" data-increment={1}>
                      {sittingInfos.totalMinute}<small> dk</small></p>
                    <h4>Toplam Oturma Süresi</h4>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <div className="tv-clients-counter">
                    <p className="counter" data-slno={1} data-min={0} data-max={45} data-delay=".9" data-increment={1}>
                      {sittingInfos.count}</p>
                    <h4>Toplam Oturma Sayısı</h4>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <div className="tv-clients-counter">
                    <p className="counter" data-slno={1} data-min={0} data-max={95} data-delay=".9" data-increment={1}>
                      {turkishDateFormat(new Date(sittingInfos.endTime)).slice(0,13)}</p>
                    <h4>Son Ziyaret Tarihi</h4>
                  </div>
                </div>
                </div>
            </div>
          </div>
    
        )
      }
        
    }

    renderSpecial(){
        return (
    <div>
                 <section id="special">
        <div className="tv-special-color tv-section-padding-20">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-sm-4 col-xs-12">
                <div className="tv-special-info">
               
                  <div className="tv-special-block-title">
                    <h4>Lezzetli Yiyecekler</h4>    
                  </div>
                  <div className="tv-special-block-desc">
                    <p>Quisque dignissim consectetur est, eget tempor ante. Aliquam hendrerit elementum dui non ultrices.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <div className="tv-special-info">
                
                  <div className="tv-special-block-title">
                    <h4>Özel Tarifler</h4>    
                  </div>
                  <div className="tv-special-block-desc">
                    <p>Quisque dignissim consectetur est, eget tempor ante. Aliquam hendrerit elementum dui non ultrices.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <div className="tv-special-info">
            
                  <div className="tv-special-block-title">
                    <h4>Ekonomik Fiyat</h4>    
                  </div>
                  <div className="tv-special-block-desc">
                    <p>Quisque dignissim consectetur est, eget tempor ante. Aliquam hendrerit elementum dui non ultrices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
        )
    }
    render() {
        return (
            <div>
                {this.renderBanner()}
                {this.renderSittingInfos()}
                {this.renderSpecial()}
            </div>
        )
    }
}
