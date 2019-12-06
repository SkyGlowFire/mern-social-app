import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getPosts} from "../../actions/post";
import PostItem from './PostItem'
import PostForm from './PostForm'

const Posts = ({post:{posts, loading}, getPosts}) => {
    useEffect(() => {
        getPosts()
    }, [getPosts]);
    return (
        <Fragment>
            {loading
                ? <Spinner/>
                : <Fragment>
                    <h1 className="large text-primary">Posts</h1>
                    <p className="lead">
                        <i className="fas fa-user"/>
                        <span>  Welcome to the community</span>
                    </p>
                    <PostForm/>
                    <div className="posts">
                        {posts.map(post => (
                           <PostItem post={post} key = {post._id}/>
                        ))}
                    </div>
                </Fragment>
            }
        </Fragment>
    );
};

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, {getPosts})(Posts);
