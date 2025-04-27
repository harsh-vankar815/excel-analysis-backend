const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // assuming cookie name is "token"

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // assuming you encoded { id, email } etc.
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = verifyToken;