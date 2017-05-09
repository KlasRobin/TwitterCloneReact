import React, {Component} from 'react';
import PropTypes from 'prop-types';

function StatsItem(props) {
  return (
    <div className="stats-item">
      <h5>{props.count}</h5>
      <p>{props.type}</p>
    </div>
  )
}

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

ProfileContainer.propTypes = {
  username: PropTypes.string.isRequired,
  numberOfTweets: PropTypes.number.isRequired,
  numberOfFollowers: PropTypes.number.isRequired,
  numberFollowing: PropTypes.number.isRequired
};
ProfileContainer.defaultProps = {
  username: '',
  numberOfTweets: 0,
  numberOfFollowers: 0,
  numberFollowing: 0
};

export default ProfileContainer;
