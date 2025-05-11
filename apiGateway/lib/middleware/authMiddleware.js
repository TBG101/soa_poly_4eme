import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env",
});

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (token) {
        jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err.message);
                return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
            }
            req.user = decoded;
            next();
        });
    } else {
        if (req.path.startsWith("/graphql") || req.path.startsWith("/api")) {
            console.warn("No authorization token provided for protected route:", req.path);
        }
        req.user = null;
        next();
    }
};

export default authMiddleware;
