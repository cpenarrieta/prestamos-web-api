const router = require('express').Router();
const verifyUser = require('./auth').verifyUser;
const controller = require('./controller');

// before we send back a jwt, lets check
// the data match RENIEC Api
router.post('/signin', verifyUser(), controller.signin);

module.exports = router;
