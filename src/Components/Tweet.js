import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DeleteIcon from 'react-icons/lib/md/close';
import SweetAlert from 'sweetalert-react';

/*******************
 Tweet component
 *******************/
/*
* Component for rendering tweets. Contains authors name, profilepic (currently just a
* placeholder), tweet text and timestamp (formatted with momentJS. Also contains an
* option of deleting a tweet (if author is the same as the logged in user). Also
* contains a SweetAlert for confirming the deleting of tweets.
* */
class Tweet extends Component {

  /* Set initial state */
  constructor(props) {
    super(props);

    this.state = {
      showDeleteBtn: false,
      showSwal: false
    }
  }

  /* Handle mouse hover event and show delete button */
  handleMouseEnter = () => {
    this.setState({showDeleteBtn: true});
  }

  /* Handle mouse hover leave event and hide delete button */
  handleMouseLeave = () => {
    this.setState({showDeleteBtn: false});
  }

  /* Handle tweet delete click. Show confirmation Sweetalert */
  handleShowDelete = () => {
    this.setState({
      showSwal: true
    })
  }

  /* Handle tweet delete event */
  handleDelete = () => {
    /* Hide confirmation dialog */
    this.setState({
      showSwal: false
    });

    /* Call parent deleteTweet function */
    this.props.deleteTweet(this.props.messageId);
  }

  /* Tweet component render function */
  render() {
    var displayDate = moment(this.props.pubDate);
    var now = moment();
    console.log(now.isSame(displayDate, 'day'));
    /* Check if tweet timestamp is within the same day. If it is, display as
     * moment fromNow format e.g "för 3 minuter sedan", else display as date and time */
    if(now.isSame(displayDate, 'day')){
      displayDate =  moment(this.props.pubDate).locale('sv').fromNow();
    }else {
      displayDate =  moment(this.props.pubDate).locale('sv').format('D MMM YYYY \n\u2022 HH:mm');
    }


    return (
      <div className="tweet" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="container-horizontal tweet-header">
          <div className="author"><img
            src="https://www.webpagefx.com/data/marketing-persona-generator/img/placeholder.png"
            alt="Placeholder profile pic"/>
          <h4>{this.props.author.username}</h4></div>
          {/* Shorthand if statement. If logged in user is author and tweet hovered, show delete button*/
            (this.props.authorId === this.props.loggedInUserId && this.state.showDeleteBtn)
          &&
            <div className="delete-btn" title="Ta bort" onClick={this.handleShowDelete}>
              <DeleteIcon/>
            </div>
          }
        </div>
        <div className="tweet-content">
          <p>{this.props.content}</p>
          <small className="time-stamp">Postat {displayDate}</small>
        </div>
        <SweetAlert
          show={this.state.showSwal}
          title="Är du säker?"
          text="Vill du ta bort din tweet?"
          type="warning"
          showCancelButton={true}
          confirmButtonText="Ta bort"
          cancelButtonText="Avbryt"
          onOutsideClick={() => this.setState({showSwal: false})}
          onCancel={() => this.setState({showSwal: false})}
          onConfirm={this.handleDelete}
        />
      </div>
    );
  }
}

/* Tweet proptypes*/
Tweet.propTypes = {
  author: PropTypes.object.isRequired,
  authorId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  messageId: PropTypes.number.isRequired,
  pubDate: PropTypes.number.isRequired,
  loggedInUserId: PropTypes.number.isRequired,
  deleteTweet: PropTypes.func.isRequired
};

/* Export tweet*/
export default Tweet;
