const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const override = require('method-override');
const config = require('../config/config');

module.exports = (app) => {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors({origin: config.clientUrl}));
  app.options('*', cors({origin: config.clientUrl}));
  app.use(override());
};
