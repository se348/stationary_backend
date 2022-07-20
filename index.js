const express = require('express')
const app =express()
const winston = require('winston')

require('./startup/logging')();
require('./startup/routes')(app)
require('./startup/db')();
require('./startup/config')()
require('./startup/useradding')();
require('./startup/prod')(app)

let port = process.env.PORT || 3000;
module.exports = app.listen(port, () => winston.info(`Listening on port ${port}...`));

