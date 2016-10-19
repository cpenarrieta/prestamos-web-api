const Bank = require('./bankModel');
const _ = require('lodash');

exports.params = (req, res, next, id) => {
  Bank
    .findById(id)
    .exec()
    .then((bank) => {
      if (!bank) {
        next(new Error('No bank with that id'));
      } else {
        req.bank = bank; // eslint-disable-line
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  Bank
    .find({})
    .exec()
    .then((banks) => {
      res.json(banks);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getOne = (req, res) => {
  res.json(req.bank);
};

exports.post = (req, res, next) => {
  const newBank = new Bank(req.body);

  newBank
    .save()
    .then((bank) => {
      res.json(bank);
    })
    .catch((err) => {
      next(err);
    });
};

exports.put = (req, res, next) => {
  const bank = req.bank;
  const update = req.body;
  _.merge(bank, update);

  bank.save()
    .then((saved) => {
      res.json(saved);
    })
    .catch((err) => {
      next(err);
    });
};

exports.delete = (req, res, next) => {
  const bank = req.bank;
  bank.disabled = true;

  bank.save()
    .then((saved) => {
      res.json(saved);
    })
    .catch((err) => {
      next(err);
    });
};
