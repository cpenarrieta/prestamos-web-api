const router = require('express').Router(); // eslint-disable-line

router.use('/users', require('./user/userRoutes'));
router.use('/quotes', require('./quote/quoteRoutes'));
router.use('/bank', require('./bank/bankRoutes'));

module.exports = router;
