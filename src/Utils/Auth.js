import axios from 'axios';

class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage and redirect to dashboard.
   *
   * @param {string} token
   */
  static authenticateUser(token, history) {
    localStorage.setItem('token', token);
    axios.get('http://localhost:8080/api/users/loggedInUser',{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
        history.push('/dashboard');
      });
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove token and user object from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

}

export default Auth;