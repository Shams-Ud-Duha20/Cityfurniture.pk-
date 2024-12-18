module.exports = async function (req, res, next) {
    if (!req.session.user?.role.includes("admin")) {
      console.log("Access denied. Redirecting to login. (admin-middleware)");
      return res.redirect("/login");
    }
    next();
  };