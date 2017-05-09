import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DeleteIcon from 'react-icons/lib/md/close';
import SweetAlert from 'sweetalert-react';

class Tweet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showDeleteBtn: false,
      showSwal: false
    }
  }

  handleMouseEnter = () => {
    this.setState({showDeleteBtn: true});
  }

  handleMouseLeave = () => {
    this.setState({showDeleteBtn: false});
  }

  handleDelete = () => {
    this.setState({
      showSwal: false
    });

    this.props.deleteTweet(this.props.messageId);
  }

  render() {
    return (
      <div className="tweet" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="container-horizontal tweet-header">
          <div className="author"><img
            src="https://www.webpagefx.com/data/marketing-persona-generator/img/placeholder.png"
            alt="Placeholder profile pic"/>
          <h4>{this.props.author.username}</h4></div>
          {(this.props.authorId === this.props.loggedInUserId && this.state.showDeleteBtn)
          &&
            <div className="delete-btn" title="Ta bort" onClick={() => this.setState({showSwal: true})}>
              <DeleteIcon/>
            </div>
          }
        </div>
        <div className="tweet-content">
          <p>{this.props.content}</p>
          <small className="time-stamp">{moment(this.props.pubDate).locale('sv').format('HH:mm - D MMM YYYY')}</small>
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

Tweet.propTypes = {
  author: PropTypes.object.isRequired,
  authorId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  messageId: PropTypes.number.isRequired,
  pubDate: PropTypes.number.isRequired,
  loggedInUserId: PropTypes.number.isRequired,
  deleteTweet: PropTypes.func.isRequired
};
Tweet.defaultProps = {};

export default Tweet;
