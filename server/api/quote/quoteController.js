const moment = require('moment');
const quoteCalculator = require('./quoteCalculator').calculate;

function getDetails() {
  let total = 50000;
  const details = [];
  let prev = moment().add(1, 'months');
  for (let i = 1; i <= 50; i += 1) {
    details.push({
      fecha: prev.format('D/MM/YYYY'),
      numCuota: i,
      intereses: 605.39,
      amortizacion: 203.34,
      cuota: 1234.23,
      saldo: total,
    });
    total -= 203.34;
    prev = prev.add(1, 'months');
  }

  return details;
}

const testQuote = [{
  bank: 'scotiabank',
  quote: 1250,
  rate: 0.16,
  currency: 'S/.',
  details: getDetails(),
}, {
  bank: 'bbva',
  quote: 1320,
  rate: 0.17,
  currency: 'S/.',
  details: getDetails(),
}, {
  bank: 'interbank',
  quote: 1120,
  rate: 0.14,
  currency: 'S/.',
  details: getDetails(),
}];

exports.post = (req, res) => {
  const result = quoteCalculator({ rate: 0.15, amount: 50000, timeInMonths: 60 });
  res.json(testQuote);
};

exports.finishQuote = (req, res) => {
  res.json({ confirmationNumber: 'ABC1234' });
};
