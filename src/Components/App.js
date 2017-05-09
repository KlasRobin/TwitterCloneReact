import React, { Component } from 'react';
import Login from './Login';
import Dashboard from './Dashboard'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Auth from '../Utils/Auth';

function checkAuthentication() {
  return Auth.isUserAuthenticated();
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuthentication() ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/'
        }}/>
      )
  )}/>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login}/>
          <PrivateRoute path="/dashboard" component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

module.exports = App;