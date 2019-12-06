import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getPost} from "../../actions/post";
import PostItem from './PostItem'
import {Link} from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({post:{post, loading}, getPost, match}) => {
    useEffect(()=> {
        getPost(match.params.id)
    }, [getPost, match.params.id]);
    return (
        <Fragment>
            {loading || post === null ? <Spinner/>
            : <Fragment>
                    <Link to= '/posts' className = 'btn'>Back to Posts</Link>
                    <PostItem showActions = {false} post={post}/>
                    <CommentForm postId={post._id}/>
                    <div className="comments">
                        {post.comments.map(comment => (
                            <CommentItem key = {comment._id} comment = {comment} postId = {post._id}/>
                        ))}
                    </div>
                </Fragment>
            }
        </Fragment>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, {getPost})(Post);
