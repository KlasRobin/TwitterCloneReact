import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Api from '../Utils/Api';
import {Button} from 'reactstrap';

class UserItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isFollowing: props.isFollowing
    }
  }

  handleFollowUser = () => {
    Api.followUser(this.props.userId, this.props.loggedInUserId).then(function(response) {
      console.log(response);
      this.setState({
        isFollowing: true
      });
    }.bind(this));

    this.props.incrementFollowings();
  }

  handleUnfollowUser = () => {
    Api.unfollowUser(this.props.userId, this.props.loggedInUserId).then(function(response) {
      console.log(response);
      this.setState({
        isFollowing: false
      })
    }.bind(this))

    this.props.decrementFollowings();
  }

  render() {
      return (
      <div className="container-horizontal user-item">
        <img
          src="https://www.webpagefx.com/data/marketing-persona-generator/img/placeholder.png"
          alt="Placeholder profile pic"/>
        {this.props.username}
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

class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state= {
      users: []
    }
  }

  componentDidMount() {
   Api.getAllUsers().then(function(response) {

     var users = response.data.slice();
      console.log(users, users.length);
     for(var i = 0; i < users.length; i++) {
       users[i].isFollowing = false;
       for(var j = 0; j < users[i].followers.length; j++) {
         if(users[i].followers[j].followerId === this.props.loggedInUserId) {
           users[i].isFollowing = true;
         }
       }
     }

     this.setState({
       users: users
     })
   }.bind(this))
  }

  render() {
    var loggedInUserId = this.props.loggedInUserId;
    var users = this.state.users.filter(function(user) {
      return user.userId !== loggedInUserId;
    }).splice(0,4);
    return (
      <div className="profile-container">
        <h5>Användare</h5>
        {
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

UsersContainer.propTypes = {
  loggedInUserId: PropTypes.number.isRequired,
  incrementFollowings: PropTypes.func.isRequired,
  decrementFollowings: PropTypes.func.isRequired
};
UsersContainer.defaultProps = {};

export default UsersContainer;
