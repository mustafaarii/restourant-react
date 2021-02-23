import React, { Component } from 'react'
import Header from './Header'
import RouteComponent from './RouteComponent'

export default class App extends Component {

  render() {
    return (
      <div>
        <Header/>
        <RouteComponent/>
      </div>
    )
  }
}
