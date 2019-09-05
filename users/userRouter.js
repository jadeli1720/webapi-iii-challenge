const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb')

const router = express.Router();

router.use(express.json());


/************************* POST **************************/
router.post('/', validateUser, (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ errorMessage: "Please provide a name for the user" })
    } else {
        User.insert(req.body)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the user to the database" })
            })
    }
});

router.post('/:id/posts', (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(404).json({ message: "Please provide the text for the post." })
    } else {
        Post.insert(req.body)
            .then(id => {
                res.status(201).json(id)
            })
            .catch(() => {
                res.status(500).json(
                    { error: "There was an error while saving the post to the database" }
                )
            })
    }
});

/************************* GET **************************/
router.get('/',  (req, res) => {
    User.get()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(() => {
            res.status(500).json({ error: "The user information could not be retrieved" })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    const userId = req.params.id;

    User.getById(userId)
        .then(id => {
            res.status(200).json(id)
        })
        .catch(() => {
            res.status(500).json({
                error: "The user information with the specified ID could not be retrieved."
            });
        });
});

router.get('/:id/posts', (req, res) => {
    const postId = req.params.id;

    if (!postId) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        User.getUserPosts(postId)
            .then(post => {
                res.status(200).json(post)

            })
            .catch(() => {
                res.status(500).json({
                    error: "The users post information with the specified ID could not be retrieved."
                });
            });
    }

});

/************************* Delete **************************/
router.delete('/:id', validateUserId, (req, res) => {
    const userId = req.params.id;

    User.remove(userId)
        .then(id => {
            if (id) {
                res.status(200).json(id)
            } else {
                req.status(404).json({ message: "The user with the specified ID does not exist." })
            };
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be modified" })
        });
});

router.put('/:id', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ errorMessage: "Please provide name for the user." })
    } else {
        const userId = req.params.id

        User.update(userId, req.body)
            .then(user => {
                if (user) {
                    res.status(200).json(user)
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user information could not be modified." })
            })
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const userId = req.params.id
    User.getById(userId)
        .then(user => {
            console.log(user)
            if (user) {
                req.user = user;
                next()
            } else {
                res.status(400).json({ message: "invalid user id" })
            }
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "Could not validate user with the specified id" })
        })
};

function validateUser(req, res, next) {
    console.log(req.body)//returns empty object. req.body = {}
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))//returns a boolean indicating whether the object has the specified property as its own property 
                return false;
        }
        return true;
    }
    
    if(isEmpty(req.body)) {
        res.status(400).json({ message: "missing user data" })
    } else if (!req.body.name){
        res.status(400).json({ message: "missing required name field"  })
    }

    next()
};

function validatePost(req, res, next) {

};

module.exports = router;
