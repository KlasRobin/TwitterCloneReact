import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'reactstrap';
import CreateIcon from 'react-icons/lib/fa/pencil';
import RefreshIcon from 'react-icons/lib/md/refresh';
import Api from '../Utils/Api';
import Tweet from './Tweet';

/*******************
 CreateTweetForm component
 *******************/
/*
* Form for creating a new tweet. Contains input field, character counter, and submit button.
*
* */

class CreateTweetForm extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);

    this.state = {
      characterCounter: 140,
      tweetText: ''
    }
  }

  /* Handle input field change. Update tweetText and char counter with each change */
  handleChange = (e) => {
      this.setState({
        characterCounter: 140 - e.target.value.length,
        tweetText: e.target.value
      })
  }

  /* Handle form submit */
  handleSubmit = (e) => {
    /* Prevent default form behaviour */
    e.preventDefault();

    /* Call parent submit tweet function and pass tweet text from inputfield */
    this.props.submitTweet(this.state.tweetText);

    /* Reset input field and char counter */
    this.setState({
      characterCounter: 140,
      tweetText: ''
    })
  }

  /* CreateTweetForm render function */
  render() {
    return (
      <form className="create-tweet-form" onSubmit={this.handleSubmit}>
        <Input
          onChange={this.handleChange}
          value={this.state.tweetText}
          placeholder="Skapa en tweet..."
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

/* CreateTweetForm proptypes */
CreateTweetForm.PropTypes = {
  handleSubmit: PropTypes.func.isRequired
}

/*******************
 TweetContainer component
 *******************/
/*
* Container for listing tweets. Also contains the create tweet form.
* */

class TweetContainer extends Component {
  /* Set initial state */
  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
      showCreateForm: false,
    }
  }

  /* Lifecycle event function for when component mounts. Fetches tweets from API */
  componentDidMount() {
    this.fetchTweets();
  }

  /* Toggle create tweet form show/hide */
  toggleForm = () => {
    this.setState({
      showCreateForm: !this.state.showCreateForm
    })
  }

  /* API call to fetch tweet feed for logged in user */
  fetchTweets = () => {
    Api.getUserFeed(this.props.loggedInUserId).then(function(data) {

      this.setState({
        tweets: data
      })

    }.bind(this))
  }

  /* Post a tweet */
  postTweet = (tweetText) => {

    /* Api call for posting tweets*/
    Api.postTweet(tweetText).then(function(data) {

      /* Call parent function to increments number of tweets by one */
      this.props.incrementTweets();

      /* Append the new tweet to tweets array in state */
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

  /* Delete a tweet */
  deleteTweet = (tweetId) => {

    /* Api call for deleting a tweet */
    Api.deleteTweet(tweetId).then(function(result) {
      /* Call parent function to decrement number of tweets by one */
      this.props.decrementTweets();

      /* Filter tweets array and remove deleted tweet and update state.  */
        var temp = this.state.tweets.filter(function(tweet) {
          return tweet.messageId !== tweetId;
        })
        this.setState({tweets: temp});
      }.bind(this))
  }

  /* Render method for TweetContainer */
  render() {

    /* Sort tweets by newest */
    var tweets = this.state.tweets.sort(function(a, b) {
      return b.pubDate - a.pubDate;
    });

    return (
      <div className="tweet-container">
        <div className="tweet-container-header">
          <h4>Tweets</h4>
          <div>
            <Button onClick={this.toggleForm} title="Skapa tweet">
              <CreateIcon/>
            </Button>
            <Button onClick={this.fetchTweets} title="Uppdatera">
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
          {/* Map over tweets array and render one Tweet component for each tweet, passing it
           all necessary props*/
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

/* TweetContainer proptypes */
TweetContainer.propTypes = {
  loggedInUserId: PropTypes.number.isRequired,
  loggedInUserName: PropTypes.string.isRequired,
  incrementTweets: PropTypes.func.isRequired,
  decrementTweets: PropTypes.func.isRequired
};

/* Export TweetContainer component */
export default TweetContainer;
