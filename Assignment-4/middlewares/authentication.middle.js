module.exports = async function (req, res, next) {
    if (!req.session.user) {
      console.log("No user session. Redirecting to login.(auth-middleware)");
      return res.redirect("/login");
    }
    console.log("auth-middleware User session found : ", req.session.user);
    next();
  };