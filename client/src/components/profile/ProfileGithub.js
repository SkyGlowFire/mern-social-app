import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {getRepos} from '../../actions/profile'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'

const ProfileGithub = ({getRepos, username, repos}) => {
    useEffect(()=> {
        getRepos(username)
    }, [getRepos, username]);
    return (
       <div className="profile-github">
           <h2 className="text-primary my-1">Github Repos</h2>
           {repos === null
               ? (<Spinner/>)
               : (repos.map(repo => (
                   <div key={repo.node_id} className= 'repo bg-white p-1 m-1'>
                        <div>
                            <h4>
                                <a href={repo.html_url} target= '_blank' rel= 'noopener noreferrer'>
                                    {repo.name}
                                </a>
                            </h4>
                            <p>{repo.description}</p>
                        </div>
                       <div>
                           <ul>
                               <li className="badge badge-primary">
                                   Stars: {repo.stargazers_count}
                               </li>
                               <li className="badge badge-primary">
                                   Watchers: {repo.watchers_count}
                               </li>
                               <li className="badge badge-primary">
                                   Forks: {repo.forks_count}
                               </li>
                           </ul>
                       </div>
                   </div>
               ))
               )
           }
       </div>
    );
};

ProfileGithub.propTypes = {
    getRepos: PropTypes.func.isRequired,
    username:PropTypes.string.isRequired,
    repos:PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    repos: state.profile.repos,
});

export default connect(mapStateToProps, {getRepos})(ProfileGithub);
