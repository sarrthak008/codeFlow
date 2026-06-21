import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import responder from "../utils/responder.js";

export const protectRoute = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        console.log(token)
        if (!token) {
            return responder(res, 401, {}, false, "Not authorized, token missing");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded , "ddecoded")
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return responder(res, 404, {}, false, "User session not found");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Middleware Error:", error.message);
        return responder(res, 401, {}, false, "Not authorized, token invalid or expired");
    }
};