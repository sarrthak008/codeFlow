import responder from "../../utils/responder.js";
import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return responder(res, 400, {}, false, "Name and password are required");
        }
        const user = await User.findOne({ name });
        console.log(user);
        if (!user) {
            return responder(res, 401, {}, false, "Invalid login credentials");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return responder(res, 401, {}, false, "Invalid login credentials");
        }
        const payload = {
            userId: user._id,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "365d"
        });
        const userData = {
            id: user._id,
            name: user.name,
            role: user.role
        };
        return responder(res, 200, { token, user: userData }, true, "Login successful");
    } catch (error) {
        console.error("Login Error:", error);
        return responder(res, 500, {}, false, "Internal server error");
    }
};

export const addManyUsers = async (req, res) => {
    try {
        const { users } = req.body;

        if (!users || !Array.isArray(users) || users.length === 0) {
            return responder(res, 400, {}, false, "Please provide an array of users to add.");
        }

        const preparedUsers = [];
        for (const user of users) {
            if (!user.name || !user.password) {
                return responder(res, 400, {}, false, "Each user must have a name and a password.");
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            preparedUsers.push({
                name: user.name.trim(),
                password: hashedPassword,
                role: user.role || "user"
            });
        }

        const savedUsers = await User.insertMany(preparedUsers);

        const sanitizedUsers = savedUsers.map(u => ({
            id: u._id,
            name: u.name,
            role: u.role
        }));

        return responder(res, 201, { users: sanitizedUsers }, true, `${sanitizedUsers.length} users added successfully.`);

    } catch (error) {
        console.error("Bulk Add Users Error:", error);
        if (error.code === 11000) {
            return responder(res, 400, {}, false, "One or more usernames already exist.");
        }
        return responder(res, 500, {}, false, "Internal server error");
    }
};
