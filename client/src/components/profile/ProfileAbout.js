import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({profile: {
    bio,
    skills,
    user: {name}
}}) => {
    return (
        <div className="profile-about bg-light p-2">
            {bio &&
            <Fragment>
                <h2 className="text-primary">{name.trim().split(' ')[0]}'s Biography</h2>
                <p>{bio}</p>
            </Fragment>
            }
            <div className="line"/>
            <h2 className="text-primary">Skill Set</h2>
            <div className="skills">
                {skills.map((skill, idx) => (
                    <div className="p-1" key={idx}>
                        <i className="fa fa-check"/>
                        {skill}
                    </div>
                    )
                )}
            </div>
        </div>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileAbout;
