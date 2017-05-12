import React, {Component} from 'react';
import PropTypes from 'prop-types';

/*******************
 StatsItem component
 *******************/
/*
* Component rendering a StatsItem with a stats type and number
* */
function StatsItem(props) {
  return (
    <div className="stats-item">
      <h5>{props.count}</h5>
      <p>{props.type}</p>
    </div>
  )
}

/* StatsItem proptypes */
StatsItem.PropTypes = {
  count: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
}

/*******************
 ProfileContainer component
 *******************/
/*
* Renders a container with some information about the logged in user.
* Contains username, profilepic (currently just a placeholder) and some
* user stats (number of tweets, followers and followees)
* */
class ProfileContainer extends Component {
  render() {
    return (
      <div className="profile-container">
        <div className="container-horizontal flex-start">
          <img
            src="https://www.webpagefx.com/data/marketing-persona-generator/img/placeholder.png"
            alt="Placeholder profile pic"/>
          <h4>{this.props.username}</h4>
        </div>
        <div className="container-horizontal">
          <StatsItem count={this.props.numberOfTweets} type="Tweets"/>
          <StatsItem count={this.props.numberFollowing} type="Följer"/>
          <StatsItem count={this.props.numberOfFollowers} type="Följare"/>
        </div>
      </div>
    );
  }
}

/* Proptypes for ProfileContainer component*/
ProfileContainer.propTypes = {
  username: PropTypes.string.isRequired,
  numberOfTweets: PropTypes.number.isRequired,
  numberOfFollowers: PropTypes.number.isRequired,
  numberFollowing: PropTypes.number.isRequired
};

/* Default props for ProfileContainer component*/
ProfileContainer.defaultProps = {
  username: '',
  numberOfTweets: 0,
  numberOfFollowers: 0,
  numberFollowing: 0
};

/* Export ProfileContainer component */
export default ProfileContainer;
