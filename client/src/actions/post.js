import axios from 'axios'
import {setAlert} from '../actions/alert'
import {
    GET_POST,
    ADD_POST,
    DELETE_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKE,
    ADD_COMMENT,
    REMOVE_COMMENT
} from "./actionTypes";

//Get Posts
export const getPosts = () => async dispatch => {
    try{
        const res = await axios.get('/api/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Add Like
export const addLike = (postId) => async dispatch => {
    try{
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKE,
            payload: {postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Remove Like
export const removeLike = (postId) => async dispatch => {
    try{
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKE,
            payload: {postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Delete Post
export const deletePost = (postId) => async dispatch => {
    try{
        const res = await axios.delete(`/api/posts/${postId}`);
        dispatch({
            type: DELETE_POST,
            payload: postId
        });

        dispatch(setAlert(`${res.data.msg}`, 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Add Post
export const addPost = (formData) => async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    try{
        const res = await axios.post(`/api/posts`, formData, config);
        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert(`Post created`, 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Get Post By ID
export const getPost = (id) => async dispatch => {
    try{
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Add Comment
export const addComment = (formData, postId) => async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    try{
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert(`Comment Added`, 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//Remove Comment
export const removeComment = (postId, commentId) => async dispatch => {
    try{
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload:commentId
        });

        dispatch(setAlert(`Comment Removed`, 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};