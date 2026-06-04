const isAdminMiddleware = (req, res, next) => {
    if (req.userRole !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
        });
    }   
    next();
}

module.exports = isAdminMiddleware;