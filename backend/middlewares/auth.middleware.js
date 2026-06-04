const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing or malformed",
        });
    }

    const token = authHeader.split(" ")[1];

    const verify = jwt.verify(token, JWT_SECRET);
    if (!verify) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
    
    req.userId = verify.userId;
    req.userRole = verify.role;
    next();
    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }
}

module.exports = authMiddleware;