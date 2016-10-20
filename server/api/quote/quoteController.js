const _ = require('lodash');
const crypto = require('crypto');
const quoteCalculator = require('./quoteCalculator').calculate;
const Bank = require('../bank/bankModel');
const config = require('../../config/config');

function getAmount(amountSelected, maxAmount) {
  if (amountSelected <= maxAmount) {
    return amountSelected;
  }
  return maxAmount;
}

function getUserRate(rates, amount, segmentation, currency) {
  const rate = _(rates)
    .filter({ segmentation })
    .find((s) => {
      return (amount > s.min && amount <= s.max);
    });

  if (currency === 'S/.') {
    return rate.solesRate;
  }
  return rate.dollarRate;
}

exports.post = (req, res) => {
  const { currency, amountSelected, term, doubleQuotes } = req.body;

  const result = _.map(req.authUser.bankRates, (bankRate) => {
    const amount = getAmount(amountSelected, currency === 'S/.' ? bankRate.solesMaxAmount : bankRate.dollarMaxAmount);
    const rate = getUserRate(bankRate.bank.rates, amountSelected, bankRate.segmentation, currency);
    const { quote, details } = quoteCalculator({ rate, amount, term });

    return {
      bankId: bankRate.bank.id,
      bank: _.lowerCase(bankRate.bank.name),
      currency,
      amount,
      quote,
      details,
      rate,
      term,
      differentAmount: amount !== amountSelected,
    };
  });

  res.json(result);
};

function generateQuoteCode(request) {
  const key = crypto.pbkdf2Sync(JSON.stringify(request), config.secrets.salt, 100000, 3, 'sha512');
  return key.toString('hex').toUpperCase();
}

exports.finishQuote = (req, res, next) => {
  const { bankId, quote, rate, amount, currency, term } = req.body.quote;
  const code = generateQuoteCode({ user: req.authUser, bankId, quote, rate, amount, currency, term, date: new Date() });

  Bank
    .findById(bankId)
    .exec()
    .then((bank) => {
      bank.quotes.push({
        user: req.authUser,
        totalAmount: amount,
        monthlyFee: quote,
        code,
        currency,
        rate,
        term,
      });
      return bank.save();
    })
    .then((bank) => {
      res.json({ code, amount, currency, rate, quote, term, bankName: bank.name });
    })
    .catch((err) => {
      next(err);
    });
};
