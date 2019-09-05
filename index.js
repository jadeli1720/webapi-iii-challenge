const server = require('./server');
require('dotenv').config()

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`\n** API on port ${port}**\n`))
