const express = require('express');
const Post = require('./postDb');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    Post.get()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved" })
        })
});

router.get('/:id', validatePostId, (req, res) => {
    const postId = req.params.id;

    Post.getById(postId)
        .then(id => {
            res.status(200).json(id)
        })
        .catch(() => {
            res.status(500).json({
                error: "The post information with the specified ID could not be found."
            });
        });

});

router.delete('/:id', validatePostId, (req, res) => {
    const postId = req.params.id;

    if (!postId) {
        req.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        Post.remove(postId)
            .then(id => {
                res.status(200).json(id)
            })
            .catch(err => {
                res.status(500).json({ error: "The post information could not be modified" })
            });
    }

});

router.put('/:id', validatePostId, (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the user." })
    } else {
        const postId = req.params.id;
        if (!postId) {
            Post.update(postId, req.body)
                .then(post => {
                    res.status(200).json(post)
                })
                .catch(err => {
                    res.status(500).json({ error: "The post information could not be modified." })
                })
        }
    }
});

// custom middleware

function validatePostId(req, res, next) {
    const postId = req.params.id
    Post.getById(postId)
        .then(post => {
            console.log(post)
            if (post) {
                req.post = post;
            } else {
                res.status(400).json({ message: "invalid post id" })
            }
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "Could not validate post with the specified id" })
        })
    next()
};

module.exports = router;