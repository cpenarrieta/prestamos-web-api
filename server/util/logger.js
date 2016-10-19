require('colors');
const config = require('../config/config');

const noop = () => {};
const consoleLog = config.logging ? console.log.bind(console) : noop;

const logger = {
  log(...args) {
    const tag = '[ ✨ LOG ✨ ]'.green;
    const output = args.map((arg) => {
      if (typeof arg === 'object') {
        const string = JSON.stringify(arg, null, 2);
        return `${tag}   ${string.cyan}`;
      }
      return `${tag}   ${arg.cyan}`;
    });

    consoleLog.apply(console, output);
  },

  error(...args) {
    const output = args.map((arg) => {
      arg = arg.stack || arg;
      const name = arg.name || '[ ❌ ERROR ❌ ]';
      const log = `${name.yellow}   ${arg.red}`;
      return log;
    });

    consoleLog.apply(console, output);
  },
};

module.exports = logger;
