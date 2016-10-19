const moment = require('moment');
const _ = require('lodash');

exports.calculate = ({ rate, amount, timeInMonths }) => {
  const dailyRate = Math.pow(1 + rate, 0.00277777777777778) - 1;
  const details = [];
  let prev = moment();
  let difDays = 0;
  let accumulatedDays = 0;
  let factors = 0;
  for (let i = 1; i <= timeInMonths; i += 1) {
    difDays = moment(prev).add(1, 'months').diff(prev, 'days');
    accumulatedDays = difDays + (details.length > 0 ? _.last(details).accumulatedDays : 0);
    prev = prev.add(1, 'months');
    factors = Math.pow(1 / (1 + dailyRate), accumulatedDays);
    const obj = { i, date: prev.calendar(), difDays, accumulatedDays, factors };
    details.push(obj);
  }

  const sumFactor = _(details).map(n => { return n.factors; }).sum();
  const quote = amount / sumFactor;
  let interest = 0;
  let amortization = 0;
  let balance = amount;
  for (let i = 1; i <= timeInMonths; i += 1) {
    interest = (Math.pow(1 + dailyRate, details[i - 1].difDays) - 1) * balance;
    amortization = quote - interest;
    balance -= amortization;

    details[i - 1].interest = interest;
    details[i - 1].balance = balance;
    details[i - 1].amortization = amortization;
  }

  return {
    quote,
    details,
  };
};
