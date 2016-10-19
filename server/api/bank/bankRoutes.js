const router = require('express').Router(); // eslint-disable-line
const controller = require('./bankController');

// const checkUser = [auth.decodeToken(), auth.getFreshUser()]; // TODO

router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(controller.post);

router.route('/:id')
  .get(controller.getOne)
  .put(controller.put)
  .delete(controller.delete);

module.exports = router;
