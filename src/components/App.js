import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux/actions/userActions'
import RouteComponent from './RouteComponent'

class App extends Component {

  componentWillMount() {
      this.props.actions.setUser(); //ana component yüklenirken sunucuya kullanıcı bilgileri için istek atılır
  }

  render() {
    const { user } = this.props;
    if (user === null) {
      return null;
    } // eğer kullanıcı yoksa componentler dönülmez

    return (
      <div>
        <Header />
        <RouteComponent />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer
  }

}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      setUser: bindActionCreators(userActions.setUser, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)