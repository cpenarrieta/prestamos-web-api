const User = require('./userModel');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

exports.params = (req, res, next, id) => {
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  User.find({})
    .exec()
    .then((users) => {
      res.json(users.map((user) => {
        return user;
      }));
    })
    .catch((err) => {
      next(err);
    });
};

exports.getOne = (req, res, next) => {
  res.json(req.user);
};

exports.put = (req, res, next) => {
  var user = req.user;
  var update = req.body;
  _.merge(user, update);

  user.save()
    .then((saved) => {
      res.json(saved);
    })
    .catch((err) => {
      next(err);
    });
};

exports.post = (req, res, next) => {
  var newUser = new User(req.body);

  newUser.save()
    .then((user) => {
      const token = signToken(user._id);
      res.json({
        token: token
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.delete = (req, res, next) => {
  req.user.remove()
    .then((removed) => {
      res.json(removed);
    })
    .catch((err) => {
      next(err);
    });
};

exports.me = (req, res) => {
  res.json(req.user);
};
