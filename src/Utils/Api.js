import axios from 'axios';
import querystring from 'querystring';
import Auth from './Auth';

/* Base URL for API to shorten URL strings in API calls */
var BASE_URL = 'http://localhost:8080';

/* Basic config for API calls with basic authorization */
var BASIC_CONFIG = {
  headers: {
    'Authorization': 'Basic dHdpdHRlci1jbG9uZS1jbGllbnQ6MTIzNDU2',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  xhrFields: {
    withCredentials: false
  }
};

module.exports = {

  /*******************
   User services
   *******************/

  /* Register a user */
  registerUser: function(user) {
    return axios.post(BASE_URL + '/register/',
      {
        username: user.username,
        email: user.email,
        password: user.password
      }
    ).then(function(response) {
      console.log(response);
      return response;
    }).catch(function(error) {
      return error.response;
    });
  },

  /* Authenticate a user and log that user in */
  login: function(username, password) {
    return axios.post(BASE_URL + '/oauth/token',
      querystring.stringify({
        'grant_type': 'password',
        'client_secret': 123456,
        'client_id': 'twitter-clone-client',
        'username': username,
        'password': password
      }), BASIC_CONFIG).then(function(response) {
      return response;
    }).catch(function(error) {
      return error.response;
    });
  },

  /* Check user currently logged in. Returns user object */
  getLoggedInUser: function() {
    return axios.get(BASE_URL + '/api/users/loggedInUser', {
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    })
      .then(function(response) {
        return response;
      });
  },

  /* Get list of users followed by a specific user */
  getFollowees: function(userId) {
    return axios.get(BASE_URL + '/api/users/' + userId + '/followees', {
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    })
      .then(function(response) {
        return response;
      });
  },

  /* Follow a user */
  followUser: function(userToFollow, userFollowing) {
    return axios.put(BASE_URL + '/api/users/' + userFollowing + '/follow/' + userToFollow,
      {},
      {
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken()
        }
      }).then(function(response) {
      return response;
    }).catch(function(error) {
      console.warn(error);
    });
  },

  /* Stop following a user */
  unfollowUser: function(userToUnfollow, userUnfollowing) {
    return axios.put(BASE_URL + '/api/users/' + userUnfollowing + '/unfollow/' + userToUnfollow,
      {},
      {
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken()
        }
      }).then(function(response) {
      return response;
    }).catch(function(error) {
      console.warn(error);
    });
  },

  /* Get list of all registered users */
  getAllUsers: function() {
    return axios.get(BASE_URL + '/api/users/', {
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    })
      .then(function(response) {
        return response;
      });
  },

  /*******************
   Tweet services
   *******************/

  /* Get list of tweets by a specific user */
  getTweetsByAuthor: function(userId) {
    return axios.get(BASE_URL + '/api/tweets/author/' + userId, {
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    })
      .then(function(response) {
        return response;
      });
  },

  /* Get list of tweets that includes said users tweets plus all tweets
   * from users that user is following */
  getUserFeed: function(userId) {
    return axios.get(BASE_URL + '/api/tweets/follower/' + userId, {
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    })
      .then(function(response) {
        return response.data;
      });
  },

  /* Post a tweet */
  postTweet: function(tweetText) {
    return axios.post(BASE_URL + '/api/tweets/',
      {
        'content': tweetText,
      }, {
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken(),
          'Content-type': 'application/json'
        }
      }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.warn(error);
    });
  },

  /* Delete a posted tweet */
  deleteTweet: function(tweetId) {
    return axios.delete(BASE_URL + '/api/tweets/' + tweetId,
      {
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken(),
          'Content-type': 'application/json'
        }
      }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.warn(error);
    });
  }
}