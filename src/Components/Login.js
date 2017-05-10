import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Nav, NavItem, NavLink, Alert} from 'reactstrap';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import api from '../Utils/Api';
import SweetAlert from 'sweetalert-react';
import Auth from '../Utils/Auth';

/*******************
 InputField component
 *******************/
/*
* Consists of input field and label. Used in
* both register and login form.
* */
class InputField extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }

  /* Handle changes made to input field */
  handleChange = (e) => {
    /* Set state to new value */
    let val = e.target.value;
    this.setState(function() {
      return {
        value: val
      }
    });

    /* Call parent onChange function to change form state */
    this.props.onChange(this.props.name, val);
  }

  /* Render function for InputField component */
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

/* Proptypes for InputField component. Specifies what props are
 * required and what type they must be */
InputField.PropTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

/* Default props if no props are provided */
InputField.defaultProps = {
  placeholder: '',
  value: ''
}

/*******************
 RegisterForm component
 *******************/
/*
* The form for registering a user in the application.
* Consists of the form itself and a SweetAlert component for
* showing a success message and initially hidden error messages.
* */
class RegisterForm extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      showSwal: false,
      formHasErrors: false,
      emailTaken: false,
      usernameTaken: false
    }
  }

  /* Handle form submit */
  handleSubmit = (e) => {
    /* Prevent default form submission behaviour */
    e.preventDefault();

    /* Register user API call */
    api.registerUser(this.state).then(function(response) {

      /* Check response status code*/
      /* If status code equals 201 (Success): Show success SweetAlert component
       * and hide potential error messages */
      if(response.status === 201) {
        this.setState({
          showSwal: true,
          formHasErrors: false,
          emailTaken: false,
          usernameTaken: false
        });
      }
      /* If status code equals to 409 (conflict) and message concerns email, show error
       * alerts and email exists alert text */
      else if (response.status === 409 && response.data.message === 'Email already taken') {
        this.setState({
          formHasErrors: true,
          emailTaken: true,
          usernameTaken: false
        });
      }
      /* If status code equals to 409 (conflict) and message concerns username, show error
       * alerts and username exists alert text */
      else if (response.status === 409 && response.data.message === 'Username already taken') {
        this.setState({
          formHasErrors: true,
          emailTaken: false,
          usernameTaken: true
        });
      }
    }.bind(this));
  }

 /* Handle change from child InputFields components */
  handleChange = (prop, value) => {
    /* Create temporary object */
    var obj = {};

    /* Pass property name and value to temp object */
    obj[prop] = value;

    /* Set state with temp object */
    this.setState(obj);
  }

  /* Handle SweetAlert confirm button click */
  handleConfirm = () => {
    /* Hide sweetalert */
    this.setState({
      showSwal: false
    });

    /* Call callback function in parent component */
    this.props.onConfirm(this.state.username);
  }

  /* Render function for RegisterForm component */
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
        {/* Shorthand if statement. Renders JSX after && if expression before && equals to true*/}
        {this.state.formHasErrors &&
        <Alert color="danger">
          {this.state.emailTaken &&
          <span><strong>Fel! </strong>Email redan upptagen</span>
          }
          {this.state.usernameTaken &&
          <span><strong>Fel! </strong>Användarnamn redan upptagen</span>
          }
        </Alert>
        }
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

/* RegisterForm proptypes */
RegisterForm.PropTypes = {
  onConfirm: PropTypes.func.isRequired
}

/*******************
 LoginForm
 *******************/
/*
 * The form for logging in to the application.
 * Consists of the form itself and and an initially hidden error message.
 * */
class LoginForm extends Component {

  /* Set initial state*/
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      password: '',
      loginError: false
    }
  }

  /* Handle login form submit */
  handleSubmit = (e) =>{

    /* Prevent default form submitting behaviour */
    e.preventDefault();

    /* API call to log in user */
    api.login(this.state.username, this.state.password).then(function(response) {
      /* Check response status code*/
      /* If status code equals to 200 (Success) */
      if(response.status === 200){
        /* Authenticate user and pass in response token and route history. Hide potential
         * error message. */
        Auth.authenticateUser(response.data.access_token, this.props.history);
        this.setState({
          loginError: false
        });
      }
      /* If status code equals to 400 (Bad request) show login error message
      (wrong password/username) */
      else if (response.status === 400) {
        this.setState({
          loginError: true
        });
      }
    }.bind(this));
  }

  /* Handle change to form parameters from child components */
  handleChange = (prop, value) => {
    var obj = {};
    obj[prop] = value;
    this.setState(obj);
  }

  /* Render function for LoginForm component */
  render() {
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h3>Logga In</h3>
        {this.state.loginError &&
        <Alert color="danger">
          <strong>Fel! </strong>Felaktigt användarnamn och/eller lösenord!
        </Alert>}
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

/* LoginForm proptypes specifications */
LoginForm.PropTypes = {
  username: PropTypes.string.isRequired
}

/* LoginForm default props */
LoginForm.defaultProps = {
  username: ''
}

/*******************
 User services
 *******************/
/*
* Login view component. Consists of RegisterForm and LoginForm and
* a navbar to toggle between the two. Front page of application
* */
class Login extends Component {

  /* Set inital state */
  constructor(props){
    super(props);

    this.state = {
      activeTab: 'login',
      username: ''
    }

  }

  /* Handle when a user switches tab. Set activeTab state to clicked tab */
  handleTabChange = (tab) => {
    this.setState({
        activeTab: tab
    });
  }

  /* Select usertab and set username input field value to passed username */
  openLoginFromRegister = (username) => {
    this.setState({
      activeTab: 'login',
      username: username
    });
  }

  /* Login component render function */
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

/* Export Login component */
export default Login;
