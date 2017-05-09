import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'reactstrap';
import CreateIcon from 'react-icons/lib/fa/pencil';
import RefreshIcon from 'react-icons/lib/md/refresh';
import Api from '../Utils/Api';
import Tweet from './Tweet';

class CreateTweetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characterCounter: 140,
      tweetText: ''
    }
  }

  handleChange = (e) => {
      this.setState({
        characterCounter: 140 - e.target.value.length,
        tweetText: e.target.value
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.submitTweet(this.state.tweetText);
    this.setState({
      characterCounter: 140,
      tweetText: ''
    })
  }

  render() {
    return (
      <form className="create-tweet-form" onSubmit={this.handleSubmit}>
        <Input
          onChange={this.handleChange}
          value={this.state.tweetText}
          maxLength="140"
        />
        <div className="controls">
          {this.state.characterCounter}
          <Button>Skicka</Button>
        </div>
      </form>
    )
  }
}

class TweetContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
      showCreateForm: false,
    }
  }

  componentDidMount() {
    this.fetchTweets();
  }

  toggleForm = () => {
    this.setState({
      showCreateForm: !this.state.showCreateForm
    })
  }

  fetchTweets = () => {
    Api.getUserFeed(this.props.loggedInUserId).then(function(data) {

      this.setState({
        tweets: data
      })

    }.bind(this))
  }

  postTweet = (tweetText) => {
    Api.postTweet(tweetText).then(function(data) {
      this.props.incrementTweets();

      var temp = this.state.tweets.slice();
      temp.push({
        author: {
         username: this.props.loggedInUserName
        },
        authorId: data.authorId,
        content: data.content,
        messageId: ((Math.random() * 10000) + 2000),
        pubDate: (new Date()).getTime()
      });

      this.setState({
        tweets: temp,
        showCreateForm: false
      });

    }.bind(this));
  }

  deleteTweet = (tweetId) => {
      Api.deleteTweet(tweetId).then(function(result) {
        this.props.decrementTweets();
        var temp = this.state.tweets.filter(function(tweet) {
          return tweet.messageId !== tweetId;
        })
        this.setState({tweets: temp});
      }.bind(this))
  }

  render() {
    var tweets = this.state.tweets.sort(function(a, b) {
      return b.messageId - a.messageId
    });
    return (
      <div className="tweet-container">
        <div className="tweet-container-header">
          <h4>Tweets</h4>
          <div>
            <Button onClick={this.toggleForm}>
              <CreateIcon/>
            </Button>
            <Button onClick={this.fetchTweets}>
              <RefreshIcon/>
            </Button>
          </div>
        </div>
        {this.state.showCreateForm &&
          <CreateTweetForm
            submitTweet={this.postTweet}
          />
        }
        <div>
          {
            tweets.map(function(tweet) {
              return (
                <Tweet
                key={tweet.messageId}
                author={tweet.author}
                authorId={tweet.authorId}
                content={tweet.content}
                messageId={tweet.messageId}
                pubDate={tweet.pubDate}
                loggedInUserId={this.props.loggedInUserId}
                deleteTweet={this.deleteTweet}
              />)
            }.bind(this))
          }
        </div>
      </div>
    );
  }
}

TweetContainer.propTypes = {
  loggedInUserId: PropTypes.number.isRequired,
  loggedInUserName: PropTypes.string.isRequired,
  incrementTweets: PropTypes.func.isRequired,
  decrementTweets: PropTypes.func.isRequired
};

export default TweetContainer;
