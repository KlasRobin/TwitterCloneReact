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
/**
 * Dashboard view for logged in users. Contains Tweet feed, Userlist and
 * a section with logged in user name and stats for num of tweets, followers and
 * followees
 * **/
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

  /* Lifecycle event function for when component mounts */
  componentDidMount() {

    /* Get number of users following the logged in user */
    Api.getFollowees(this.state.loggedInUser.userId).then(function(response) {
      this.setState({
        followeesCount: response.data.length
      })
    }.bind(this));

    /* Get number of tweets made by logged in user */
    Api.getTweetsByAuthor(this.state.loggedInUser.userId).then(function(response) {
      this.setState({
        tweetCount: response.data.length
      })
    }.bind(this));
  }

  /* Handle click event from logout buttom */
  handleClick = () => {
    /* Deauthenticate user i.e remove all parameters in localStorage */
    Auth.deauthenticateUser();

    /* Route user to root-route i.e login view */
    this.props.history.push('/');
  }

  /* Increment tweetCount in state by one */
  incrementTweets = () => {
    this.setState({
      tweetCount: this.state.tweetCount + 1
    });
  }

  /* Decrement tweetCount in state by one */
  decrementTweets = () => {
    this.setState({
      tweetCount: this.state.tweetCount -1
    })
  }

  /* Increment followeesCount in state by one */
  incrementFollowings = () => {
    this.setState({
      followeesCount: this.state.followeesCount + 1
    });
  }

  /* Decrement followeesCount in state by one */
  decrementFollowings = () => {
    this.setState({
      followeesCount: this.state.followeesCount -1
    })
  }

  /* Render function for dashboard component */
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

/* Export component so it can be imported in other files  */
export default Dashboard;
