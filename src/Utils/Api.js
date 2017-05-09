import axios from 'axios';
import querystring from 'querystring';
import Auth from './Auth';

// var CLIEND_ID = 'dHdpdHRlci1jbG9uZS1jbGllbnQ6cGFzc3dvcmQ=';
var BASE_URL = 'http://localhost:8080';

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
      console.log(error);
    });
  },

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
      console.warn(error);
    });
  },
  
  getLoggedInUser: function() {
    return axios.get(BASE_URL + '/api/users/loggedInUser',{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        return response;
      });
  },

  getFollowees: function(userId) {
    return axios.get(BASE_URL + '/api/users/' + userId + '/followees',{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        return response;
      });
  },

  getTweetsByAuthor: function(userId) {
    return axios.get(BASE_URL + '/api/tweets/author/' + userId,{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        return response;
      });
  },

  getUserFeed: function(userId) {
    return axios.get(BASE_URL + '/api/tweets/follower/' + userId,{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        return response.data;
      });
  },

  getAllUsers: function() {
    return axios.get(BASE_URL + '/api/users/',{ headers: {
      'Authorization': 'Bearer ' + Auth.getToken()}
    })
      .then(function(response) {
        return response;
      });
  },

  postTweet: function(tweetText) {
    return axios.post(BASE_URL + '/api/tweets/',
      {'content': tweetText,
      },{ headers: {
        'Authorization': 'Bearer ' + Auth.getToken(),
        'Content-type': 'application/json'
      }
      }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.warn(error);
    });
  },

  deleteTweet: function(tweetId) {
    return axios.delete(BASE_URL + '/api/tweets/' + tweetId,
      { headers: {
        'Authorization': 'Bearer ' + Auth.getToken(),
        'Content-type': 'application/json'
      }
      }).then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.warn(error);
    });
  },
  
  followUser: function(userToFollow, userFollowing) {
    return axios.put(BASE_URL + '/api/users/' + userFollowing + '/follow/' + userToFollow,
      {},
      { headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
      }).then(function(response) {
      return response;
    }).catch(function(error) {
      console.warn(error);
    });
  },

  unfollowUser: function(userToUnfollow, userUnfollowing) {
    return axios.put(BASE_URL + '/api/users/' + userUnfollowing + '/unfollow/' + userToUnfollow,
      {},
      { headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
      }).then(function(response) {
      return response;
    }).catch(function(error) {
      console.warn(error);
    });
  }
}