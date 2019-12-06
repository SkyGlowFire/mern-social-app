import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {addPost} from "../../actions/post";

const PostForm = ({addPost}) => {
    const [formData, setFormData] = useState({
        text: ''
    });

    const {text} = formData;
        const onSubmit = e => {
            e.preventDefault();
            addPost(formData);
            setFormData({...formData, [e.target.name]: ''})
        };
        const onChange = e => {
            setFormData({...formData, [e.target.name]: e.target.value});
        };
    return (
           <div className="post-form">
               <div className="bg-primary p">
                   <h3>Say something...</h3>
               </div>
               <form className="form my-1"
                    onSubmit={e => onSubmit(e)}
               >
          <textarea
              onChange={e => onChange(e)}
              name="text"
              cols="30"
              rows="5"
              placeholder="Type text here"
              required
              value={text}
          />
                   <input type="submit" className="btn btn-dark my-1" value="Submit"/>
               </form>
           </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired
};

export default connect(null, {addPost})(PostForm) ;
