import React, { useState, useRef } from "react";

const ServerClientStatusHighlighter = ({ clientI = false, serverI = false, hasRun = false }) => {
    return (
        <div className="flex gap-4 opacity-50 text-xs font-mono">
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


const ConsoleTerminalPanel = ({ 
    consoleHeight, 
    output, 
    isUserWriteCode, 
    isLoading, 
    isSubmitting, 
    isAdmin = true, // Admin role is currently enabled
    onRunCode, 
    onSubmitAnswer, 
    onGenerateNewQuestion, 
    onOpenLogin, 
    onAdminCommandSubmit 
}) => {
    const [adminCommand, setAdminCommand] = useState("");
    const [isCommandRunning, setIsCommandRunning] = useState(false);
    const inputRef = useRef(null);

    const handleAdminSubmit = async (e) => {
        if (e.key === "Enter" && adminCommand.trim() !== "") {
            setIsCommandRunning(true);
            try {
                if (onAdminCommandSubmit) await onAdminCommandSubmit(adminCommand);
            } catch (error) {
                console.error("Admin command failed:", error);
            } finally {
                setAdminCommand("");
                setIsCommandRunning(false);
            }
        }
    };

    return (
        <div 
            className="bg-black flex flex-col shrink-0 border-t border-gray-800"
            style={{ height: `${consoleHeight}px` }}
        >
            {/* Toolbar Area */}
            <div className="w-full px-4 py-2 border-b border-gray-800 flex items-center justify-between shrink-0 select-none">
                <h2 className="text-green-400 font-medium flex items-center gap-2 text-sm">
                    <i className="ri-terminal-box-line"></i>
                    Console Output
                </h2>
                <div className="flex items-center gap-3">
                    <ServerClientStatusHighlighter 
                        clientI={output.isClientIssue} 
                        serverI={output.isSuccess} 
                        hasRun={output.hasRun}
                    />
                    
                    <button
                        disabled={!isUserWriteCode}
                        onClick={onRunCode}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                            isUserWriteCode ? "cursor-pointer text-white hover:text-green-400" : "text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <i className="ri-play-fill"></i> Run
                    </button>

                    <button
                        disabled={!isUserWriteCode || isSubmitting}
                        onClick={onSubmitAnswer}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                            isUserWriteCode && !isSubmitting ? "cursor-pointer text-white hover:bg-white/5" : "text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <i className={isSubmitting ? "ri-loader-4-line animate-spin" : "ri-upload-2-fill"}></i>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                    <button
                        disabled={isLoading}
                        onClick={onGenerateNewQuestion}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-gray-800 transition-all ${
                            isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600/40 cursor-pointer text-green-400"
                        }`}
                    >
                        <i className={isLoading ? "ri-loader-4-line animate-spin" : "ri-add-line text-lg"}></i>
                    </button>

                    <button
                        onClick={onOpenLogin}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-gray-800 hover:bg-blue-600/60 cursor-pointer transition-all text-blue-400"
                    >
                        <i className="ri-shield-user-fill"></i>
                    </button>
                </div>
            </div>

            {/* Logs & Input Area */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs flex flex-col">
                <div className="space-y-3 flex-1">
                    {!output.hasRun ? (
                        <p className="text-gray-500">Console is empty. Run your code to see outputs.</p>
                    ) : output.isSuccess ? (
                        <div>
                            <p className="text-gray-400">Result: {output?.output}</p>
                            <div className="mt-1">
                                {output?.logs?.map((op, index) => (
                                    <div key={index} className="text-gray-300">{op}</div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <span className="text-red-400">{output.output}</span>
                        </div>
                    )}
                </div>

                {/* Admin Input Field */}
                {isAdmin && (
                    <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-800/50 text-green-400 shrink-0">
                        <span className="select-none">root@codeflow:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={adminCommand}
                            onChange={(e) => setAdminCommand(e.target.value)}
                            onKeyDown={handleAdminSubmit}
                            disabled={isCommandRunning}
                            className={`flex-1 bg-transparent outline-none border-none text-gray-200 placeholder-gray-700 font-mono text-xs ${isCommandRunning ? "opacity-50" : "opacity-100"}`}
                            placeholder="Enter admin command..."
                            autoComplete="off"
                        />
                        {isCommandRunning && <i className="ri-loader-4-line animate-spin text-gray-500"></i>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsoleTerminalPanel;