import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {removeComment} from '../../actions/post'
import Moment from 'react-moment'

const CommentItem = ({ postId, auth, comment:{text, name, user, avatar, date, _id}, removeComment }) => {

    return (
        <Fragment>
            <div className="post bg-white p-1 my-1">
                <div>
                    <Link to = {`/profile/${user}`}>
                        <img
                            className="round-img"
                            src={avatar}
                            alt=""
                        />
                        <h4>{name}</h4>
                    </Link>
                </div>
                <div>
                    <p className="my-1">
                        {text}
                    </p>
                    <p className="post-date">
                        Posted on <Moment format = 'YYYY/MM/DD - HH:MM'>{date}</Moment>
                    </p>

                        {!auth.loading && user === auth.user._id && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeComment(postId,_id)}
                            >
                                <i className="fas fa-times"/>
                            </button>
                        )}
                </div>
            </div>
        </Fragment>
    );
};

CommentItem.propTypes = {
    removeComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {removeComment})(CommentItem);
