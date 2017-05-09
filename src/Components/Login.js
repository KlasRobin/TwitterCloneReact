import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Nav, NavItem, NavLink} from 'reactstrap';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import api from '../Utils/Api';
import SweetAlert from 'sweetalert-react';
import Auth from '../Utils/Auth';


class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value === undefined ? '': props.value
    }
  }

  handleChange = (e) => {
    let val = e.target.value;
    this.setState(function() {
      return {
        value: val
      }
    });
    this.props.onChange(this.props.name, val);
  }

  render() {
    return (
      <div className="input-field">
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input
          type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

InputField.PropTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

InputField.defaultProps = {
  placeholder: '',
  value: ''
}

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      email: '',
      showSwal: false
    }

  }

  handleSubmit = (e) => {
    e.preventDefault();

    api.registerUser(this.state).then(function(response) {
      // this.setState({showSwal: true})
    });
  }


  handleChange = (prop, value) => {
    var obj = {};
    obj[prop] = value;
    this.setState(obj);
  }

  handleConfirm = () => {
    this.setState({
      showSwal: false
    });
    this.props.onConfirm(this.state.username);
  }

  render() {
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h3>Registera</h3>
        <InputField
          label="Användarnamn"
          type="text"
          name="username"
          onChange={this.handleChange}
        />
        <InputField
          label="E-mail"
          type="email"
          name="email"
          onChange={this.handleChange}
        />
        <InputField
          label="Lösenord"
          type="password"
          name="password"
          onChange={this.handleChange}
        />
        <Button
          disabled={this.state.username === '' || this.state.password === '' || this.state.email === ''}
          color="primary"
        >
          Registrera
        </Button>
        <SweetAlert
          show={this.state.showSwal}
          title="Färdigt!"
          text="Du är nu registrerad"
          type="success"
          onConfirm={this.handleConfirm}
          onOutsideClick={() => this.setState({showSwal: false})}
          confirmButtonText="Logga in"
          confirmButtonColor="#0275d8"
        />
      </form>
    );
  }
}

RegisterForm.PropTypes = {
  onConfirm: PropTypes.func.isRequired
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      password: ''
    }
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    api.login(this.state.username, this.state.password).then(function(response) {
      if(response.status === 200){
        Auth.authenticateUser(response.data.access_token, this.props.history);
      }
    }.bind(this));
  }

  handleChange = (prop, value) => {
    var obj = {};
    obj[prop] = value;
    this.setState(obj);
  }

  render() {
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h3>Logga In</h3>
        <InputField
          label="Användarnamn"
          type="text"
          name="username"
          onChange={this.handleChange}
          value={this.props.username}
        />
        <InputField
          label="Lösenord"
          type="password"
          name="password"
          onChange={this.handleChange}
        />
        <Button color="primary">Logga in</Button>
      </form>
    );
  }
}

LoginForm.PropTypes = {
  username: PropTypes.string.isRequired
}

LoginForm.defaultProps = {
  username: ''
}

class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      activeTab: 'login',
      username: ''
    }

  }

  handleTabChange = (tab) => {
    this.setState({
        activeTab: tab
    });
  }


  openLoginFromRegister = (username) => {
    this.setState({
      activeTab: 'login',
      username: username
    });
  }

  render() {
    var history = this.props.history;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={this.state.activeTab === 'login'}
              onClick={() => this.handleTabChange('login')}
            >Logga in</NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab === 'register'}
              onClick={() => this.handleTabChange('register')}
            >Registrera</NavLink>
          </NavItem>
        </Nav>
        <div className="container-vertical">
          <h1 className="header">
            <TwitterIcon color="#40c7ff"/>
            <span>@</span>
            Kvitter
          </h1>
          {this.state.activeTab === 'login' &&
          <LoginForm
            username={this.state.username}
            history={history}
          />}
          {this.state.activeTab === 'register' &&
          <RegisterForm
            onConfirm={this.openLoginFromRegister}
          />}
        </div>
      </div>
    );
  }
}

export default Login;
