const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

//@route        Post api/users
//description   Register user
//@access       public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({min:6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name, email, password} = req.body;

    try {
        //See if User exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]})
        }

        //Get user's gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //save User to DataBase
        await user.save();

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 36000},
            (error, token) => {
                if (error) throw error;
                res.json({token});
            }
            );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }



});

module.exports = router;