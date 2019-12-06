const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@route        POST api/posts
//description   create post
//@access       private
router.post('/', [auth,
        [check('text', 'Please enter text').not().isEmpty()]
    ],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route        GET api/posts
//description   get all posts
//@access       private
router.get('/', auth, async (req,res) => {
    try {
        const posts= await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route        GET api/posts/:id
//description   get post by Id
//@access       private
router.get('/:id', auth, async (req,res) => {
    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: "Post not found"});
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send('Server error');
    }
});

//@route        DELETE api/posts/:id
//description   delete post by Id
//@access       private
router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: "Post not found"});
        }

        //check User
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'})
        }

        await post.remove();

        res.json({msg: 'Post removed'});
    } catch (err) {
        console.error(err.message);
        if(err.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send('Server error');
    }
});

//@route        PUT api/posts/like/:id
//description   Like a post
//@access       private
router.put('/like/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: "Post already liked"});
        }
        post.likes.unshift({user:req.user.id});

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route        PUT api/posts/unlike/:id
//description   Unlike a post
//@access       private
router.put('/unlike/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: "Post has not been liked"});
        }

        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route        POST api/posts/comment/:id
//description   Comment a  post
//@access       private
router.post('/comment/:id', [auth,
        [check('text', 'Please enter text').not().isEmpty()]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const post = await Post.findById(req.params.id);

            const newComment = ({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

//@route        DELETE api/posts/comment/:postId/:commentId
//description   Delete a comment
//@access       private
router.delete('/comment/:postId/:commentId', auth, async (req,res) => {
        try {
            const post = await Post.findById(req.params.postId);
            const comment = post.comments.find(comment => comment.id === req.params.commentId);
            if(!comment) {
                return res.status(404).json({msg: "Comment doesnt exist"});
            }

            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({msg: "User not athorized to delete this comment"});
            }

            const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.commentId);
            post.comments.splice(removeIndex, 1);
            await  post.save();
            res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;