let User = require("../models/user.model");
// module.exports = async function (req, res, next) {
//   let defaultUser = await User.findOne({ email: "abcXYZ1122@gmail.com" });
//   req.session.user = defaultUser;
//   res.locals.user = req.session.user;
//   req.user = req.session.user;
//   next();
// };

module.exports = async function (req, res, next) {
  if (!req.session.user) {
      let defaultUser = await User.findOne({ username: "raonoor360@gmail.com" });
      req.session.user = defaultUser;
  }
  res.locals.user = req.session.user;
  req.user = req.session.user;
  next();
};