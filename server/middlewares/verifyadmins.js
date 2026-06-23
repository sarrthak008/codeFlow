import jwt from "jsonwebtoken";
import responder from "../utils/responder.js";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return responder(res, 401, {}, false, "Access denied. No token provided.");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") {
            return responder(res, 403, {}, false, "Access denied. Admin role required.");
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        return responder(res, 401, {}, false, "Invalid or expired token.");
    }
};

export default verifyAdmin