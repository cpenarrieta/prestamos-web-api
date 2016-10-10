const router = require('express').Router();

router.use('/users', require('./user/userRoutes'));
router.use('/quotes', require('./quote/quoteRoutes'));

module.exports = router;
