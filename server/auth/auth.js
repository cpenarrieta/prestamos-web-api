const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/config');
const User = require('../api/user/userModel');

const checkToken = expressJwt({ secret: config.secrets.jwt, requestProperty: 'authUser' });

exports.decodeToken = () => {
  return (req, res, next) => {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) { // eslint-disable-line
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }

    // this will call next if token is valid and send error if its not.
    // It will attach the decoded token to req.authUser
    checkToken(req, res, next);
  };
};

exports.getFreshUser = () => {
  return (req, res, next) => {
    User.findById(req.authUser.id)
      .then((user) => {
        if (!user) {
          // if no user is found it was not it was a valid JWT but didn't decode
          // to a real user in our DB. Either the user was deleted
          // since the client got the JWT, or it was a JWT from some other source
          res.status(401).send('Unauthorized');
        } else {
          // update req.authUser with fresh user from stale token data
          req.authUser = user;
          next();
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};

exports.verifyUser = () => {
  return (req, res, next) => {
    const dni = req.body.dni;
    if (!dni) {
      res.status(400).send('You need a dni');
      return;
    }

    User.findOne({ dni })
      .then((user) => {
        if (user) {
          // TODO: check with RENIEC
            // res.status(401).send('Invalid DNI');
          return user;
        }
        return User.create(req.body);
      })
      .then((user) => {
        req.authUser = user;
        next();
      })
      .catch((err) => {
        next(err);
      });
  };
};

// util method to sign tokens on signup
exports.signToken = (id) => {
  return jwt.sign(
    { id },
    config.secrets.jwt,
    { expiresIn: config.expireTime }
  );
};
