const express = require('express');
const User = require('./userDb');

const router = express.Router();

router.use(express.json());


/************************* POST **************************/
router.post('/', (req, res) => {
    const {name} = req.body;
    
    if(!name) {
        res.status(400).json({errorMessage: "Please provide a name for the user"})
    } else {
        User.insert(req.body)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({error: "There was an error while saving the user to the database"})
            })
    }
});

router.post('/:id/posts', (req, res) => {
    const {text} = req.body;

    if(!text) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        User.insert(req.body)
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
router.get('/', (req, res) => {
    User.get()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(() => {
            res.status(500).json({ error: "The user information could not be retrieved" })
        })
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;

    User.getById(userId)
        .then(id => {
            if(id) {
                res.status(200).json(id)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(() => {
            res.status(500).json({
                error: "The user information with the specified ID could not be retrieved."
            });
        });
});

router.get('/:id/posts', (req, res) => {
    const postId = req.params.id;
    console.log(req.body)

    User.getUserPosts(postId)
        .then(post =>{
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({  message: "The post with the specified ID does not exist." })
            }
        })
        .catch(() => {
            res.status(500).json({
                error: "The users post information with the specified ID could not be retrieved."
            });
        });
});

/************************* Delete **************************/
router.delete('/:id', (req, res) => {
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
            res.status(500).json({error: "The user information could not be modified"})
        });
});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
