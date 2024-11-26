import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwtoken;
    
    if(!token) {
        return res.status(403).json({ success: false, message: "Unauthorized access: No token provided" });
    }

    try {
        // This will throw an error if the token is invalid, no need for a second check for decoded
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId; // Add userId to req object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        return res.status(401).json({ message: "Error in verifying token" });
    }
};
