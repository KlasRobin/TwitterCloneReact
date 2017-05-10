import React, {Component} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import Api from '../Utils/Api';
import Auth from '../Utils/Auth'
import ProfileContainer from './ProfileContainer';
import UsersContainer from './UsersContainer';
import TweetContainer from './TweetContainer';
import TwitterIcon from 'react-icons/lib/fa/twitter';

/*******************
 Dashboard component
 *******************/

class Dashboard extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);

    /* Fetch loggedInUser object from localStorage */
    var loggedInUser = JSON.parse(localStorage.loggedInUser);
    this.state = {
      loggedInUser: loggedInUser,
      followersCount: loggedInUser.followers.length,
      followeesCount: 0,
      tweetCount: 0
    }
  }

  componentDidMount() {
    Api.getFollowees(this.state.loggedInUser.userId).then(function(response) {
      this.setState({
        followeesCount: response.data.length
      })
    }.bind(this));

    Api.getTweetsByAuthor(this.state.loggedInUser.userId).then(function(response) {
      this.setState({
        tweetCount: response.data.length
      })
    }.bind(this));
  }

  handleClick = () => {
    Auth.deauthenticateUser();
    this.props.history.push('/');
  }

  incrementTweets = () => {
    this.setState({
      tweetCount: this.state.tweetCount + 1
    });
  }

  decrementTweets = () => {
    this.setState({
      tweetCount: this.state.tweetCount -1
    })
  }

  incrementFollowings = () => {
    this.setState({
      followeesCount: this.state.followeesCount + 1
    });
  }

  decrementFollowings = () => {
    this.setState({
      followeesCount: this.state.followeesCount -1
    })
  }

  render() {
    return (
      <div>
        <Nav pills className="dashboard-nav">
          <div/>
          <div className="container-horizontal">
            <TwitterIcon className="logo-bird"/>
            <h3 className="logo"><span>@</span>Kvitter</h3>
          </div>
              <NavItem onClick={this.handleClick}>
                <NavLink>Logga ut</NavLink>
              </NavItem>
        </Nav>
        <div className="dashboard">
          <div>
            <ProfileContainer
              username={this.state.loggedInUser.username}
              numberOfFollowers={this.state.followersCount}
              numberFollowing={this.state.followeesCount}
              numberOfTweets={this.state.tweetCount}
            />
            <UsersContainer
              loggedInUserId={this.state.loggedInUser.userId}
              incrementFollowings={this.incrementFollowings}
              decrementFollowings={this.decrementFollowings}
            />
          </div>
          <TweetContainer
            loggedInUserId={this.state.loggedInUser.userId}
            loggedInUserName={this.state.loggedInUser.username}
            incrementTweets={this.incrementTweets}
            decrementTweets={this.decrementTweets}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
