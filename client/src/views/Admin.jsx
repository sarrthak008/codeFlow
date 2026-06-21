import React, { useState, useEffect } from "react";
import axios from "axios";

// ==========================================
// 1. GLOBAL COMPONENTS (MODALS & NOTIFICATIONS)
// ==========================================

const Notification = ({ message }) => {
    if (!message.text) return null;
    return (
        <div className={`fixed top-6 right-10 p-4 rounded-xl border backdrop-blur-xl text-sm shadow-xl flex items-center gap-2.5 transition-all z-[100] ${
            message.isError ? "bg-red-950/40 border-red-500/30 text-red-400" : "bg-green-950/40 border-green-500/30 text-green-400"
        }`}>
            <i className={message.isError ? "ri-error-warning-line" : "ri-checkbox-circle-line"}></i>
            <span>{message.text}</span>
        </div>
    );
};

const GlassModal = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fadeIn">
            <div className="w-full max-w-md p-6 bg-white/[0.03] backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/[0.08] relative space-y-6">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
                        <i className={`${icon} text-gray-400`}></i> {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-red-600/20 hover:text-red-400 transition-all cursor-pointer"
                    >
                        <i className="ri-close-line text-lg"></i>
                    </button>
                </div>

                {/* Modal Body Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

// ==========================================
// 2. SUB-ACTION CORE COMPONENTS (TAB LOGIC)
// ==========================================

const AddUserForm = ({ onClose, showNotification }) => {
    const [formData, setFormData] = useState({ name: "", password: "", role: "user" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.password) {
            showNotification("Please fill in all user profile items.", true);
            return;
        }
        try {
            const token = localStorage.getItem("authToken");
            await axios.post("http://localhost:3000/admin/add-users", {
                users: [{ name: formData.name.trim(), password: String(formData.password), role: formData.role }]
            }, { headers: { Authorization: `Bearer ${token}` } });

            showNotification(`User "${formData.name}" added successfully.`);
            onClose();
        } catch (error) {
            showNotification(error.response?.data?.message || "Failed to create user.", true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><i className="ri-user-3-line"></i> Username</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter username handle"
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none text-sm focus:border-white/30 text-white"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><i className="ri-lock-password-line"></i> Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none text-sm focus:border-white/30 text-white"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><i className="ri-git-repository-private-line"></i> Privilege Level</label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/[0.08] rounded-lg outline-none text-sm text-gray-300 focus:border-white/30"
                >
                    <option value="user">User Privilege</option>
                    <option value="admin">Admin Privilege</option>
                </select>
            </div>
            <button type="submit" className="w-full py-3 mt-2 bg-white hover:bg-gray-100 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <i className="ri-user-shared-line text-lg"></i> Save Profile Key
            </button>
        </form>
    );
};

const AddQuestionForm = ({ onClose, showNotification }) => {
    const [formData, setFormData] = useState({ title: "", date: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.date) {
            showNotification("Title and Target Calendar Date are required.", true);
            return;
        }
        try {
            const token = localStorage.getItem("authToken");
            await axios.post("http://localhost:3000/admin/add-question", {
                title: formData.title.trim(),
                targetDate: formData.date
            }, { headers: { Authorization: `Bearer ${token}` } });

            showNotification("Question added to developer calendar timeline.");
            onClose();
        } catch (error) {
            showNotification(error.response?.data?.message || "Network exception adding question schema", true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><i className="ri-terminal-box-line"></i> Challenge Prompt</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Reverse an Array"
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none text-sm focus:border-white/30 text-white"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><i className="ri-calendar-event-line"></i> Activation Target Date</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-lg outline-none text-sm text-gray-300 focus:border-white/30"
                />
            </div>
            <button type="submit" className="w-full py-3 mt-2 bg-white hover:bg-gray-100 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <i className="ri-file-add-line text-lg"></i> Bind to Calendar
            </button>
        </form>
    );
};

// ==========================================
// 3. MAIN DASHBOARD CONTAINER
// ==========================================

const AdminDashboard = () => {
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", isError: false });

    // Modal Visibility Controllers
    const [modals, setModals] = useState({ user: false, question: false });

    const showNotification = (text, isError = false) => {
        setMessage({ text, isError });
        setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(response.data?.data?.users || response.data?.users || []);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="w-screen h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            
            {/* --- CORE CONTROL STATUS NAVBAR --- */}
            <header className="w-full px-8 py-4 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <i className="ri-shield-user-fill text-2xl text-blue-400"></i>
                    <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">CodeFlow Console</span>
                </div>

                {/* --- COMPACT HEAD ACTION BUTTONS --- */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setModals({ ...modals, user: true })}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.05] transition-all cursor-pointer"
                    >
                        <i className="ri-user-add-line text-base text-blue-400"></i> New User
                    </button>
                    
                    <button 
                        onClick={() => setModals({ ...modals, question: true })}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.05] transition-all cursor-pointer"
                    >
                        <i className="ri-add-box-line text-base text-purple-400"></i> New Question
                    </button>

                    <button 
                        onClick={fetchUsers}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.05] transition-all cursor-pointer"
                    >
                        <i className={`ri-refresh-line text-lg ${isLoading ? "animate-spin text-blue-400" : ""}`}></i>
                    </button>
                </div>
            </header>

            {/* --- DIRECTORY DATATABLE DASHBOARD SCREEN --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Active User Directory</h2>
                            <p className="text-sm text-gray-400">Total verified credential profiles matching secure index rows</p>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                            Node: Production_V2
                        </div>
                    </div>

                    {isLoading && usersList.length === 0 ? (
                        <div className="flex justify-center items-center h-48 text-gray-400 gap-2">
                            <i className="ri-loader-4-line animate-spin text-xl"></i> Updating records...
                        </div>
                    ) : (
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        <th className="p-4 pl-6">Identification Hash</th>
                                        <th className="p-4">Username Profile</th>
                                        <th className="p-4 pr-6">Access Context Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04] text-sm text-gray-300">
                                    {usersList.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="p-12 text-center text-gray-500 font-medium">No user data records found matching database query index.</td>
                                        </tr>
                                    ) : (
                                        usersList.map((usr) => (
                                            <tr key={usr._id || usr.id} className="hover:bg-white/[0.01] transition-all group">
                                                <td className="p-4 pl-6 font-mono text-xs text-gray-500 group-hover:text-gray-400">{usr._id || usr.id}</td>
                                                <td className="p-4 font-semibold text-white">{usr.name}</td>
                                                <td className="p-4 pr-6">
                                                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
                                                        usr.role === "admin" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                    }`}>
                                                        {usr.role || "user"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAL POPUPS AND MESSAGES HOOKED TO THE ONE FILE --- */}
            <Notification message={message} />

            <GlassModal 
                isOpen={modals.user} 
                onClose={() => { setModals({ ...modals, user: false }); fetchUsers(); }} 
                title="Provision New Workspace Profile" 
                icon="ri-user-add-line"
            >
                <AddUserForm onClose={() => { setModals({ ...modals, user: false }); fetchUsers(); }} showNotification={showNotification} />
            </GlassModal>

            <GlassModal 
                isOpen={modals.question} 
                onClose={() => setModals({ ...modals, question: false })} 
                title="Deploy Day-Wise Code Target" 
                icon="ri-add-box-line"
            >
                <AddQuestionForm onClose={() => setModals({ ...modals, question: false })} showNotification={showNotification} />
            </GlassModal>
        </div>
    );
};

export default AdminDashboard;