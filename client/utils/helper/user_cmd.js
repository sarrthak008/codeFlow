import axios from "axios";

const adduser = async ([name, password, role = "user"]) => {
    try {
        if (!name || !password) {
            return "Usage: add-user <name> <password> [role]";
        }

        const token = localStorage.getItem("token");

        const { data } = await axios.post(
            "http://localhost:3000/auth/adduser",
            {
                users: [
                    {
                        name,
                        password,
                        role,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return data.message;
    } catch (error) {
        return (
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create user"
        );
    }
};

export { adduser };