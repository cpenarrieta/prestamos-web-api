const express = require('express');
const mongoose = require('mongoose');
const api = require('./api/api');
const config = require('./config/config');
const logger = require('./util/logger');
const auth = require('./auth/routes');

const app = express();

app.disable('x-powered-by');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db.url);

if (config.seed) {
  require('./util/seed');
}

require('./middleware/appMiddleware')(app);

app.use('/api', api);
app.use('/auth', auth);

app.use((err, req, res) => {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }

  logger.error(err.stack);
  res.status(500).send('Oops');
});

module.exports = app;
