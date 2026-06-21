import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Login from "../components/Login";

const ServerClientStatusHighlighter = ({ clientI = false, serverI = false, hasRun = false }) => {
    return (
        <div className="flex gap-4 opacity-50">
            Server : <span className="flex items-center">
                {!hasRun ? (
                    <div className="h-[10px] w-[10px] rounded-full bg-gray-500"></div>
                ) : serverI ? (
                    <div className="h-[10px] w-[10px] rounded-full bg-green-500"></div>
                ) : (
                    <div className="h-[10px] w-[10px] rounded-full bg-red-500"></div>
                )}
            </span>

            Client : <span className="flex items-center">
                {!hasRun ? (
                    <div className="h-[10px] w-[10px] rounded-full bg-gray-500"></div>
                ) : clientI ? (
                    <div className="h-[10px] w-[10px] rounded-full bg-red-500"></div>
                ) : (
                    <div className="h-[10px] w-[10px] rounded-full bg-green-500"></div>
                )}
            </span>
        </div>
    );
};

const CodeEditor = () => {
    // Check if there's already a saved question layout in localStorage on initial mount
    const getInitialCode = () => {
        const saved = localStorage.getItem("activeChallenge");
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.editorLayoutText;
        }
        return "// Welcome! Click the '+' button to fetch your daily AI challenge.";
    };

    const [code, setCode] = useState(getInitialCode());
    const [isLoading, setIsLoading] = useState(false);
    
    const [output, setOutput] = useState({
        hasRun: false,
        isSuccess: false,
        isClientIssue: false,
        output: null,
        logs: [],
        error: null
    });
    const [isUserWriteCode, setIsUserWriteCode] = useState(false);
    const [isLoginScreen, setIsLoginScreen] = useState(false);
     
    const runCode = async () => {
        try {
            const result = await axios.post("http://localhost:3000/code/run", { code });
            setOutput({
                hasRun: true,
                isSuccess: true,
                isClientIssue: false,
                output: result?.data?.data?.output,
                logs: result?.data?.data?.logs || [],
                error: null,
            });
        } catch (error) {
            if (error.response) {
                setOutput({
                    hasRun: true,
                    isSuccess: false,
                    isClientIssue: false,
                    output: error?.response?.data?.data?.error || "Execution Error",
                    logs: error?.response?.data?.data?.logs || [],
                    error: error?.response?.data?.message || "Server Error",
                });
            } else {
                setOutput({
                    hasRun: true,
                    isSuccess: false,
                    isClientIssue: true,
                    output: error.message || "Network Error",
                    logs: [],
                    error: "Cannot connect to server",
                });
            }
        }
    };

    // ==========================================
    // 🚀 FIXED: DYNAMIC AI QUESTION GENERATION
    // ==========================================
    const handleGenerateNewQuestion = async () => {
        try {
            setIsLoading(true);
            
            // 1. Fetch token from storage
            const token = localStorage.getItem("authToken");
            console.log(token , "token")

            // 2. Make authenticated API call with header token injected
            const response = await axios.get("http://localhost:3000/codeflow/genarate", {
                withCredentials: true,
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });

            if (response.data && response.data.success) {
                const challenge = response.data.data;

                // Format a clean layout containing metadata information inside editor comments
                const formattedLayout = `/**
 * CHALLENGE: ${challenge.title}
 * CONTEXT:   ${challenge.contextDomain}
 * FOCUS:     ${challenge.technicalFocus}
 * * DESCRIPTION:
 * ${challenge.description}
 */

${challenge.starterCode || "// Write your solution logic below\n"}`;

                // Update persistent browser memory
                localStorage.setItem("activeChallenge", JSON.stringify({
                    ...challenge,
                    editorLayoutText: formattedLayout
                }));

                // Update live state canvas
                setCode(formattedLayout);
            }
        } catch (error) {
            console.error("Failed to sync AI pipeline question:", error);
            alert(error.response?.data?.message || "Authentication missing or session expired.");
        } finally {
            setIsLoading(false);
        }
    };

    const submitAnswer = () => {
        console.log("Submitted Code:", code);
        alert("Answer Submitted!");
    };

    useEffect(() => {
        // Tracks if the user modified the baseline working layout container
        const savedChallenge = localStorage.getItem("activeChallenge");
        const baselineText = savedChallenge ? JSON.parse(savedChallenge).editorLayoutText : "// Welcome! Click the '+' button to fetch your daily AI challenge.";
        setIsUserWriteCode(code.trim() !== baselineText.trim());
    }, [code]);

    return (
        <div className="w-full h-screen bg-[#0f172a] text-white flex flex-col">
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    onChange={(value) => setCode(value || "")}
                    options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        fontFamily: "JetBrains Mono",
                        fontLigatures: true,
                        smoothScrolling: true,
                        padding: { top: 10 },
                        contextmenu: false,
                        dragAndDrop: false,
                        selectionClipboard: false,
                    }}
                    onMount={(editor) => {
                        const domNode = editor.getDomNode();
                        if (!domNode) return;

                        const preventAction = (e) => e.preventDefault();
                        domNode.addEventListener("copy", preventAction);
                        domNode.addEventListener("paste", preventAction);
                        domNode.addEventListener("cut", preventAction);
                        domNode.addEventListener("dragstart", preventAction);
                        domNode.addEventListener("drop", preventAction);
                        domNode.addEventListener("dragover", preventAction);

                        domNode.addEventListener("keydown", (e) => {
                            const key = e.key.toLowerCase();
                            if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(key)) {
                                e.preventDefault();
                            }
                        });
                    }}
                />
            </div>

            <div className="h-40 bg-black border-t border-gray-800 flex flex-col">
                <div className="w-full px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="text-green-400 font-medium flex items-center gap-2">
                        <i className="ri-terminal-box-line"></i>
                        Console Output
                    </h2>
                    <div className="flex items-center gap-3">
                        <span>
                            <ServerClientStatusHighlighter 
                                clientI={output.isClientIssue} 
                                serverI={output.isSuccess} 
                                hasRun={output.hasRun}
                            />
                        </span>
                        
                        <button
                            disabled={!isUserWriteCode}
                            onClick={runCode}
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                                isUserWriteCode ? "cursor-pointer text-white" : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <i className="ri-play-fill"></i>
                            Run
                        </button>

                        <button
                            disabled={!isUserWriteCode}
                            onClick={submitAnswer}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isUserWriteCode ? "cursor-pointer text-white" : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <i className="ri-upload-2-fill"></i>
                            Submit
                        </button>

                        {/* ➕ GENERATE NEW AI QUESTION ACTION BUTTON */}
                        <button
                            disabled={isLoading}
                            onClick={handleGenerateNewQuestion}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-gray-800 transition-all ${
                                isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600/40 cursor-pointer text-green-400"
                            }`}
                            title="Generate Daily Question"
                        >
                            <i className={isLoading ? "ri-loader-4-line animate-spin" : "ri-add-line text-lg"}></i>
                        </button>

                        <button
                           onClick={() => setIsLoginScreen(true)}
                           className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-gray-800 hover:bg-blue-600/60 cursor-pointer transition-all text-blue-400"
                        >
                           <i className="ri-shield-user-fill"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                    <div className="space-y-3">
                        {!output.hasRun ? (
                            <p className="text-gray-500 text-sm">Console is empty. Run your code to see outputs.</p>
                        ) : output.isSuccess ? (
                            <div>
                                <p>Result: {output?.output}</p>
                                <div>
                                    {output?.logs?.map((op, index) => (
                                        <div key={index}>{op}</div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <span className="text-red-400">{output.output}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
           {isLoginScreen && <Login setIsLoginScreen={setIsLoginScreen} isLoginScreen={isLoginScreen} onLoginSuccess={() => {}} />}    
        </div>
    );
};

export default CodeEditor;