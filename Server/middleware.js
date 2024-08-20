const { expressjwt: jwt } = require("express-jwt");

const requireLogin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

module.exports = {
  requireLogin,
};
