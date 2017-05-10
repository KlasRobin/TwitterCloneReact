import React, { Component } from 'react';
import Login from './Login';
import Dashboard from './Dashboard'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Auth from '../Utils/Auth';

/* Check if user is authenticated */
function checkAuthentication() {
  return Auth.isUserAuthenticated();
}

/**********************
 PrivateRoute component
 **********************/
/*
* Wrapper component for Routes that checks if user is logged in.
* If not, returns a Redirect component that routes user back to
* Login view.
* */
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

/*******************
 App component
 *******************/
/*
* Main component for application
* */
class App extends Component {

  /* Render function for App component */
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

/* Export component App */
module.exports = App;