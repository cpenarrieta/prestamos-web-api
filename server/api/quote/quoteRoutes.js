const router = require('express').Router();
const controller = require('./quoteController');
const auth = require('../../auth/auth');
const checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.route('/')
  .post(checkUser, controller.post)

router.route('/finishQuote')
  .post(checkUser, controller.finishQuote)

module.exports = router;
