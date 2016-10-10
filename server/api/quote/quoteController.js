const _ = require('lodash');
const moment = require('moment');

function getDetails() {
  let total = 50000;
  let details = [];
  let prev = moment().add(1, 'months');
  for (var i=1; i<=50; i++) {

    details.push({
      fecha: prev.format("D/MM/YYYY"),
      numCuota: i,
      intereses: 605.39,
      amortizacion: 203.34,
      cuota: 1234.23,
      saldo: total
    });
    total -= 203.34;
    prev = prev.add(1, 'months');
  }

  return details;
}

const testQuote = [{
  bank: "scotiabank",
  quote: 1250,
  rate: .16,
  currency: "S/.",
  details: getDetails()
}, {
  bank: "bbva",
  quote: 1320,
  rate: .17,
  currency: "S/.",
  details: getDetails()
}, {
  bank: "interbank",
  quote: 1120,
  rate: .14,
  currency: "S/.",
  details: getDetails()
}];

exports.post = (req, res, next) => {
  res.json(testQuote);
};

exports.finishQuote = (req, res, next) => {
  res.json({confirmationNumber: "ABC1234"});
}
