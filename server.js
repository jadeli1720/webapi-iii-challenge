const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

console.log('environment', process.env.NODE_ENV);

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware
function logger(req, res, next) {
  console.log(
    `${req.method} to ${req.url} at ${new Date().toISOString()}`
    );
    next();
};

server.use(logger);

server.use('/users', userRouter);
server.use('/posts', postRouter);

module.exports = server;
