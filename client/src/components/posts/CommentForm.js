import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {addComment} from '../../actions/post'

const CommentForm = ({addComment, postId}) => {
    const [text, setText] = useState('');
    const onSubmit = e => {
        e.preventDefault();
        addComment({text}, postId);
        setText('');
    };
    const onChange = e => setText(e.target.value);
    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave A Comment</h3>
            </div>
            <form className="form my-1"
                  onSubmit={e => onSubmit(e)}
            >
          <textarea
              onChange={e => onChange(e)}
              name="text"
              cols="30"
              rows="5"
              placeholder="Comment on this post"
              required
              value={text}
          />
                <input type="submit" className="btn btn-dark my-1" value="Submit"/>
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired
};

export default connect(null, {addComment})(CommentForm);
