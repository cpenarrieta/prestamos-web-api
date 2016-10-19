const signToken = require('./auth').signToken;

exports.signin = (req, res) => {
  // req.authUser will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume
  const token = signToken(req.authUser.id);
  res.json({
    user: req.authUser,
    token,
  });
};
