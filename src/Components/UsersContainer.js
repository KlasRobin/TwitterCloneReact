import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Api from '../Utils/Api';
import {Button, Input} from 'reactstrap';

/*******************
 UserItem component
 *******************/
/*
* Item for displaying users in UsersContainer. Contains profile pic (currently just a
* placeholder), username and a follow/unfollow toggle button.
* */
class UserItem extends React.Component {

  /* Set Initial state */
  constructor(props) {
    super(props);

    this.state = {
      isFollowing: props.isFollowing
    }
  }

  /* Handle follow user button click */
  handleFollowUser = () => {
    /* Follow user API call, set state following to true */
    Api.followUser(this.props.userId, this.props.loggedInUserId).then(function(response) {
      this.setState({
        isFollowing: true
      });
    }.bind(this));

    /* Call parent function to increment number of followings by one */
    this.props.incrementFollowings();
  }

  /* Handle unfollow user button click */
  handleUnfollowUser = () => {
    /* Unfollow user API call, set state following to false */
    Api.unfollowUser(this.props.userId, this.props.loggedInUserId).then(function(response) {
      console.log(response);
      this.setState({
        isFollowing: false
      })
    }.bind(this))

    /* Call parent function to decrement number of followings by one */
    this.props.decrementFollowings();
  }

  /* UserItem render function */
  render() {
      return (
      <div className="container-horizontal user-item">
        <img
          src="https://www.webpagefx.com/data/marketing-persona-generator/img/placeholder.png"
          alt="Placeholder profile pic"/>
        {this.props.username}
        {/* Show follow/unfollow button depending on state */}
        {this.state.isFollowing &&
          <Button onClick={this.handleUnfollowUser}>Sluta följ</Button>
        }
        {!this.state.isFollowing &&
        <Button onClick={this.handleFollowUser}>Följ</Button>
        }

      </div>
    )
  }
}

/* UserItem proptypes */
UserItem.PropTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  loggedInUserId: PropTypes.number.isRequired,
  incrementFollowings: PropTypes.func.isRequired,
  decrementFollowings: PropTypes.func.isRequired
}

/************************
 UserContainer component
 ************************/
/*
* Renders a list of UserItem components.
* */

class UsersContainer extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);
    this.state= {
      users: [],
      allUsers: []
    }
  }

  /* Lifecycle event function for when component mounts */
  componentDidMount() {

    /* API call for fetching all users*/
   Api.getAllUsers().then(function(response) {
     /* Copy response data to variable*/
     var users = response.data.slice();
     /* Loop through all users followers and append isFollowing boolean property.
      * If logged in user is amongst followers, set to true. Else, set to false.*/
     for(var i = 0; i < users.length; i++) {
       users[i].isFollowing = false;
       for(var j = 0; j < users[i].followers.length; j++) {
         if(users[i].followers[j].followerId === this.props.loggedInUserId) {
           users[i].isFollowing = true;
         }
       }
     }
      /* Update state with modified user list*/
     this.setState({
       users: users,
       allUsers: users
     })
   }.bind(this))
  }

  /* Handle input in search user field */
  handleSearch = (e) => {

      /* Filter users to match text in search field */
      var temp = this.state.allUsers.filter(function(user) {
        /* Make searchtext and username lowercase to make search non case-sensitive */
        var username = user.username.toLowerCase();
        var filter = e.target.value.toLowerCase();
        return username.includes(filter);
      })
      /* Update filtered users in state */
      this.setState({
        users: temp
      })
  }

  /* UserContainer component render function */
  render() {
    var loggedInUserId = this.props.loggedInUserId;

    /* Filter user list and exclude logged in user */
    var users = this.state.users.filter(function(user) {
      return user.userId !== loggedInUserId;
    });
    return (
      <div className="profile-container">
        <h5>Användare</h5>
        <Input
          className="search-field"
          placeholder="Sök..."
          onChange={this.handleSearch}
        />
        {/* Map over users array and return on UserItem for each user with all necessary
         props */
          users.map(function(user) {
           return (
             <UserItem
               key={user.userId}
               username={user.username}
               userId={user.userId}
               isFollowing={user.isFollowing}
               loggedInUserId={this.props.loggedInUserId}
               incrementFollowings={this.props.incrementFollowings}
               decrementFollowings={this.props.decrementFollowings}
             />
             )
          }.bind(this))
        }
      </div>
    );
  }
}

/* UserContainer proptypes */
UsersContainer.propTypes = {
  loggedInUserId: PropTypes.number.isRequired,
  incrementFollowings: PropTypes.func.isRequired,
  decrementFollowings: PropTypes.func.isRequired
};

/* Export UsersContainer component */
export default UsersContainer;
