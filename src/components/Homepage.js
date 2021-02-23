import React, { Component } from 'react'

export default class Homepage extends Component {
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
                {this.renderSpecial()}
            </div>
        )
    }
}
