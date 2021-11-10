'use strict';

// Listening port is default to 3000 or get from PORT envar.
const PORT = process.env.PORT || 3000;

const server = require('./app')({
  logger: {
    level: 'info',
    prettyPrint: true
  }
});

server.listen(PORT, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
});