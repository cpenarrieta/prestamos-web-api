const jwt = require('jsonwebtoken');
const _ = require('lodash');
const expressJwt = require('express-jwt');
const config = require('../config/config');
const User = require('../api/user/userModel');
const Bank = require('../api/bank/bankModel');

const checkToken = expressJwt({ secret: config.secrets.jwt, requestProperty: 'authUser' });

function saveNoClientRates(user) {
  Bank
    .find({})
    .then((banks) => {
      const rates = _(banks)
        .map((bank) => {
          return {
            bank,
            solesMaxAmount: bank.defaultSolesMaxAmount,
            dollarMaxAmount: bank.defaultDollarMaxAmount,
            segmentation: 'No Cliente',
          };
        })
        .value();

      user.bankRates = rates;
      return user.save();
    })
    .catch(() => {
      return;
    });
}

exports.decodeToken = () => {
  return (req, res, next) => {
    // this will call next if token is valid and send error if its not.
    // It will attach the decoded token to req.authUser
    checkToken(req, res, next);
  };
};

exports.getFreshUser = () => {
  return (req, res, next) => {
    User
      .findById(req.authUser.id)
      .populate({ path: 'bankRates.bank', select: 'name rates' })
      .then((user) => {
        if (!user) {
          res.status(401).send('Unauthorized');
        } else {
          req.authUser = user;
          next();
          return null;
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

    let newUser = false;
    User
      .findOne({ dni })
      .then((user) => {
        if (user) {
          // TODO: check with RENIEC
            // res.status(401).send('Invalid DNI');
          return user;
        }
        newUser = true;
        return User.create(req.body);
      })
      .then((user) => {
        if (newUser) saveNoClientRates(user);
        req.authUser = user;
        next();
        return null;
      })
      .catch((err) => {
        next(err);
      });
  };
};

exports.signToken = (id) => {
  return jwt.sign(
    { id },
    config.secrets.jwt,
    { expiresIn: config.expireTime }
  );
};
