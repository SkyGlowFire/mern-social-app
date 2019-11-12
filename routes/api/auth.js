const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
//@route        get api/auth
//description   test route
//@access       public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error')
    }
});

//@route        Post api/auth
//description   Authenticate user and get token
//@access       public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Please enter password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email, password} = req.body;

    try {
        //See if User exists
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]})
        }

        //check password and username
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400)
                .json({errors:[{msg: "Invalid credentials"}] });
        }

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