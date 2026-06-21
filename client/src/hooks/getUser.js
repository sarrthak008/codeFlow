import { useState, useEffect } from "react";

const useUser = () => {
    // 1. Initialize state by checking localStorage immediately
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage", error);
            return null;
        }
    });

    // 2. Listen for storage changes in case login happens across components
    useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem("user");
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // 3. Return the exact user data object structure cleanly
    return user;
};

export default useUser;