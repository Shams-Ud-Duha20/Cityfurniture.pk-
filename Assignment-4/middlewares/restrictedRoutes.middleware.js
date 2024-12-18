// middlewares/restrictRoutes.middleware.js
module.exports = (req, res, next) => {
    const publicRoutes = ["/", "/admin", "/contact", "/logout"];

    if (!req.session.user || !req.session.user.role?.includes("admin")) {
        if (!publicRoutes.includes(req.path)) {
            console.log(`Access denied to route "${req.path}". Redirecting to home.`);
            return res.redirect("/");
        }
    }

    next();
};
