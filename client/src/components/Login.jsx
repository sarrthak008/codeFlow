import React, { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../hooks/getUser";

const DBURL = import.meta.env.VITE_BACKEND_URL

const Login = ({ onLoginSuccess, isLoginScreen, setIsLoginScreen }) => {
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // tracks whether the user is logged out (true means show form, false means show profile)
    const [isLogout, setIslogout] = useState(true);
    
    let userInfo = useUser();
    console.log(userInfo, "userInfo");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!formData.name.trim() || !formData.password) {
            setError("Both username and password are required.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${DBURL}/auth/login`, {
                name: formData.name.trim(),
                password: formData.password
            });

            if (response.data) {
                const token = response.data.data?.token || response.data.token;
                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                
                setIsLoginScreen(false); // Switch view to user info profile panel
                
                if (onLoginSuccess) {
                    onLoginSuccess(response.data.data?.user || response.data.user);
                }
            }
        } catch (err) {
            console.error("Login component error:", err);
            setError(
                err.response?.data?.message || 
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Explicit clear operation for clearing credentials
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setIslogout(true); // Return immediately back to raw login panel form view
    };

    useEffect(() => {
        // Match token lookup naming convention exactly with handleSubmit
        let isTokenPresent = localStorage.getItem("authToken") ? true : false;
        
        if (isTokenPresent) {
            setIslogout(false); // Token is found -> User profile screen
        } else {
            setIslogout(true);  // No token found -> Show form credentials view
        }
    }, []);

    return (
        <div className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center text-white px-4 backdrop-blur-[3px] bg-slate-950/20">
            
            {/* Ambient background glow behind the glass card */}
            <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/3 pointer-events-none"></div>
            <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full blur-3xl bottom-1/4 right-1/3 pointer-events-none"></div>

            {/* Glassmorphism Container */}
            {isLogout ? (
                /* VIEW A: LOGIN FORM CREDENTIALS PANEL */
                <div className="w-[360px] max-w-md p-8 space-y-9 bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08]">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                            <i className="ri-shield-user-line text-gray-400"></i> CodeFlow
                        </h1>
                        <p className="text-sm text-gray-400">Sign in to your workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 backdrop-blur-md rounded-lg flex items-center gap-2">
                                <i className="ri-error-warning-line text-base shrink-0"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                <i className="ri-user-3-line"></i> Username
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                disabled={isLoading}
                                className="w-full pl-4 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none transition-all focus:border-white/30 text-sm placeholder-gray-600 focus:bg-slate-950/60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                <i className="ri-lock-password-line"></i> Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="w-full pl-4 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none transition-all focus:border-white/30 text-sm placeholder-gray-600 focus:bg-slate-950/60"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 mt-2 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                                isLoading 
                                ? "bg-white/10 cursor-not-allowed text-gray-500 border border-white/[0.05]" 
                                : "bg-white hover:bg-gray-100 text-slate-950 shadow-white/5 active:scale-[0.98] cursor-pointer"
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin text-lg"></i>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <i className="ri-login-box-line text-lg"></i>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                        <div className="text-center cursor-pointer text-gray-400 hover:text-white transition-all text-sm pt-2" onClick={() => setIsLoginScreen(false)}>
                            Cancel
                        </div>
                    </form>
                </div>
            ) : (
                /* VIEW B: USER LOGGED IN PROFILE DASHBOARD PANEL */
                <div className="w-[360px] max-w-md p-8 space-y-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] flex flex-col items-center relative">
                    
                    <div className="text-center space-y-4 w-full mt-4">
                        {/* Avatar representation badge */}
                        <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <i className="ri-user-settings-line text-4xl text-gray-300"></i>
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                {userInfo?.user?.name || "Active Session"}
                            </h2>
                            <p className="text-xs font-mono uppercase tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 inline-block">
                                {userInfo?.user?.role || "User"}
                            </p>
                        </div>
                    </div>

                    <div className="w-full border-t border-white/[0.06] my-2"></div>

                    {/* Action buttons stack */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 active:scale-[0.98] cursor-pointer"
                        >
                            <i className="ri-logout-box-r-line text-lg"></i>
                            <span>Logout Session</span>
                        </button>

                        <button 
                            onClick={() => setIsLoginScreen(false)}
                            className="text-center w-full text-sm cursor-pointer"
                        >
                        cancle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;