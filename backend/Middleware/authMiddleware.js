const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    // const token = req.cookies.jwt; // Get token from cookies


    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token." });
    }
};

module.exports = authMiddleware;
