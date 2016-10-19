const _ = require('lodash');

const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 8080,
  expireTime: '60 days',
  secrets: {
    jwt: process.env.JWT || 'super secret key',
  },
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/prestamos-web',
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

const envConfig = require(`./${config.env}`) || {};

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig);
