import React, { useEffect, useState, useRef, memo } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Login from "../components/Login";
import execturcmd from "../../utils/execute";
import useUser from "../hooks/getUser";
import LeaderBoard from "../components/LeaderBoard";
import { toast } from "sonner";
const DBURL = import.meta.env.VITE_BACKEND_URL

// ============================================================================
// 📊 INTEGRATED COMPACT REPORT CARD MODAL COMPONENT (A4 / SIZE OPTIMIZED)
// ============================================================================
const CertificateModal = ({ isOpen, onClose, reviewData, userName = "Sarthak Navale" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !reviewData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 560;
        canvas.height = 720;

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
        ctx.lineWidth = 2;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 1;
        for (let i = 20; i < canvas.width; i += 25) {
            ctx.beginPath(); ctx.moveTo(i, 20); ctx.lineTo(i, canvas.height - 20); ctx.stroke();
        }
        for (let j = 20; j < canvas.height; j += 25) {
            ctx.beginPath(); ctx.moveTo(20, j); ctx.lineTo(canvas.width - 20, j); ctx.stroke();
        }

        ctx.fillStyle = "#020617";
        ctx.fillRect(30, 30, canvas.width - 60, 50);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.strokeRect(30, 30, canvas.width - 60, 50);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px monospace";
        ctx.fillText("↳ CODEFLOW // PERFORMANCE METRICS REPORT", 45, 55);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "11px monospace";
        const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
        ctx.fillText(dateStr, canvas.width - 45, 55);

        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "10px monospace";
        ctx.fillText("DEVELOPER ID:", 35, 110);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px monospace";
        ctx.fillText(userName.toUpperCase(), 35, 128);

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "10px monospace";
        ctx.fillText("OVERALL SCORE:", 35, 165);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 18px monospace";
        ctx.fillText(`${reviewData.score || 0} / 100 [${reviewData.status?.toUpperCase() || "PASSED"}]`, 35, 183);

        const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
            const words = text.split(" ");
            let line = "";
            let currentY = y;
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + " ";
                let metrics = context.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    context.fillText(line, x, currentY);
                    line = words[n] + " ";
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            context.fillText(line, x, currentY);
            return currentY + lineHeight;
        };

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "10px monospace";
        ctx.fillText("CRITICAL REFLECTION & BREAKDOWN SUMMARY:", 35, 220);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "12px monospace";
        const fbText = reviewData.feedback || "Compilation successful. Core baseline validation assertions passed matching production environment models.";
        const endFbY = wrapText(ctx, fbText, 35, 240, canvas.width - 70, 16);

        const tipsY = Math.max(endFbY + 15, 305);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "10px monospace";
        ctx.fillText("REFACTORING STRATEGIES:", 35, tipsY);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px monospace";
        let nextTipY = tipsY + 20;
        const tipsArray = reviewData.tips || ["Optimize runtime iteration structures.", "Encapsulate boundary operations edge criteria variables."];
        tipsArray.slice(0, 3).forEach((tip, idx) => {
            nextTipY = wrapText(ctx, `[${idx + 1}] ${tip}`, 35, nextTipY, canvas.width - 70, 16);
        });

        const terminalY = Math.max(nextTipY + 20, 420);
        const terminalHeight = (canvas.height - 45) - terminalY;

        ctx.fillStyle = "#020617";
        ctx.fillRect(30, terminalY, canvas.width - 60, terminalHeight);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.strokeRect(30, terminalY, canvas.width - 60, terminalHeight);

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(31, terminalY + 1, canvas.width - 62, 22);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "bold 9px monospace";
        ctx.fillText("SUGGESTED PARSED OPTIMAL REFERENCE LOGIC", 42, terminalY + 12);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "11px monospace";
        let lineY = terminalY + 45;
        const correctCodeString = reviewData.correctCode || "// Compliant solution framework metrics tracked verification.";
        const lines = correctCodeString.split("\n");

        lines.slice(0, 13).forEach((line) => {
            const truncatedLine = line.length > 65 ? line.substring(0, 62) + "..." : line;
            ctx.fillText(truncatedLine, 45, lineY);
            lineY += 15;
        });

        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("[ SYSTEM SECURITY SECURE VERIFIED LOG // SHARES ID: CF-EVAL-2026 ]", canvas.width / 2, canvas.height - 24);

    }, [isOpen, reviewData, userName]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const imageURI = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${userName.toLowerCase().replace(/\s+/g, "_")}_report.png`;
        link.href = imageURI;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
            <div className="max-w-md w-full flex flex-col items-center space-y-4">
                <div className="border border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-[#0f172a] p-1 w-full flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-auto rounded-lg max-h-[75vh] object-contain shadow-inner"
                    />
                </div>
                <div className="flex gap-3 w-full justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-800 text-xs text-gray-400 hover:text-white bg-black/20 transition-all cursor-pointer"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={downloadImage}
                        className="px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <i className="ri-download-cloud-2-line"></i>
                        Download Report PNG
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// 📊 SYSTEM STATUS DOT HIGHLIGHTER
// ============================================================================
const ServerClientStatusHighlighter = ({ clientI = false, serverI = false, hasRun = false }) => {
    // ✅ FIX: moved hover state into proper useState; removed setter call during render
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="bg-gray-600/50 cursor-pointer text-sm px-3 rounded-sm flex items-center justify-center relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            staus
            {isVisible && (
                <div className="absolute h-[40px] flex items-center justify-center w-[200px] backdrop-blur-sm z-[99] rounded-2xl bottom-[150%] bg-gray-500/50">
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
                </div>
            )}
        </div>
    );
};


// ============================================================================
// ⚡ CONSOLE PROGRESS BAR — slim animated bar shown while code is running
// ============================================================================
const ConsoleProgressBar = ({ isRunning }) => {
    const [width, setWidth] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            setVisible(true);
            setWidth(0);

            // Animate to ~85% quickly, then crawl — mimics NProgress
            let start = null;
            const animate = (ts) => {
                if (!start) start = ts;
                const elapsed = ts - start;
                // Fast ramp to 70% in 400ms, then slow crawl toward 90%
                let target;
                if (elapsed < 400) {
                    target = (elapsed / 400) * 70;
                } else {
                    target = 70 + Math.min(20, (elapsed - 400) / 100);
                }
                setWidth(target);
                rafRef.current = requestAnimationFrame(animate);
            };
            rafRef.current = requestAnimationFrame(animate);
        } else {
            // Complete the bar then fade out
            cancelAnimationFrame(rafRef.current);
            setWidth(100);
            timerRef.current = setTimeout(() => {
                setVisible(false);
                setWidth(0);
            }, 350);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(timerRef.current);
        };
    }, [isRunning]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                zIndex: 30,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${width}%`,
                    background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                    transition: isRunning
                        ? "width 0.1s linear"
                        : "width 0.25s ease-out",
                    boxShadow: "0 0 6px #38bdf8aa",
                    borderRadius: "0 2px 2px 0",
                }}
            />
        </div>
    );
};


const ConsoleTerminalPanel = ({
    consoleHeight,
    output,
    isUserWriteCode,
    isSubmitting,
    isLoading,          // ✅ added to destructure (was passed but missing here)
    isAdmin = false,
    onRunCode,
    onSubmitAnswer,
    onGenerateNewQuestion,
    onOpenLogin
}) => {
    const [adminCommand, setAdminCommand] = useState("");
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [isCommandRunning, setIsCommandRunning] = useState(false);

    // ✅ Track run state locally so the progress bar knows when to animate
    const [isRunning, setIsRunning] = useState(false);

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            await onRunCode();
        } finally {
            setIsRunning(false);
        }
    };

    const handleAdminSubmit = async (e) => {
        if (e.key !== "Enter" || !adminCommand.trim()) return;

        const command = adminCommand;

        setTerminalHistory((prev) => [
            ...prev,
            `root@codeflow:~$ ${command}`
        ]);

        setAdminCommand("");
        setIsCommandRunning(true);

        try {
            const result = await execturcmd(command);
            setTerminalHistory((prev) => [
                ...prev,
                result || "Command executed"
            ]);
        } catch (error) {
            setTerminalHistory((prev) => [
                ...prev,
                `Error: ${error.message}`
            ]);
        } finally {
            setIsCommandRunning(false);
        }
    };

    return (
        <div
            className="bg-black flex flex-col border-t border-gray-800"
            style={{ height: `${consoleHeight}px`, position: "relative" }}
        >
            {/* ✅ Progress bar sits at the very top of the panel */}
            <ConsoleProgressBar isRunning={isRunning} />

            {/* Toolbar */}
            <div className="w-full px-4 py-2 border-b border-gray-800 flex items-center justify-between shrink-0 select-none">
                <h2 className="text-green-400 font-medium flex items-center gap-2 text-sm">
                    <i className="ri-terminal-box-line"></i> Console Output
                </h2>
                <div className="flex items-center gap-3">
                    <ServerClientStatusHighlighter
                        clientI={output.isClientIssue}
                        serverI={output.isSuccess}
                        hasRun={output.hasRun}
                    />
                    <button
                        disabled={!isUserWriteCode || isRunning}
                        onClick={handleRunCode}
                        className="text-white hover:text-green-400 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        {/* ✅ Icon swaps to spinner while running */}
                        <i className={isRunning ? "ri-loader-4-line animate-spin" : "ri-play-fill"}></i>
                        Run
                    </button>
                    <button
                        disabled={!isUserWriteCode || isSubmitting}
                        onClick={onSubmitAnswer}
                        className="text-white hover:text-white/50 text-sm flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <i className={isSubmitting ? "ri-loader-4-line animate-spin" : "ri-upload-2-fill"}></i>
                        Submit
                    </button>

                    {/* ✅ + button shows spinner while isLoading (generating question) */}
                    <button
                        onClick={onGenerateNewQuestion}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center rounded bg-[#111827] border border-gray-800 text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        title="Generate new question"
                    >
                        <i className={isLoading ? "ri-loader-4-line animate-spin" : "ri-add-line"}></i>
                    </button>

                    <button
                        onClick={onOpenLogin}
                        className="w-8 h-8 flex items-center justify-center rounded bg-[#111827] border border-gray-800 text-blue-400"
                    >
                        <i className="ri-shield-user-fill"></i>
                    </button>
                </div>
            </div>

            {/* Terminal Area */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-gray-300">
                {!output.hasRun ? (
                    <p className="text-gray-500">
                        Console is empty. Run your code to see outputs.
                    </p>
                ) : output.isSuccess ? (
                    <>
                        <div className="mb-2">
                            <span className="text-gray-400">
                                Result: {output.output}
                            </span>
                        </div>
                        {output.logs?.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </>
                ) : (
                    <div className="text-red-400">
                        {output.output}
                    </div>
                )}

                {isAdmin && (
                    <>
                        {terminalHistory.map((line, index) => (
                            <div key={index} className="mt-1">
                                {line}
                            </div>
                        ))}

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-green-400 text-xl">
                                root@codeflow(admin):~$
                            </span>
                            <input
                                type="text"
                                value={adminCommand}
                                onChange={(e) => setAdminCommand(e.target.value)}
                                onKeyDown={handleAdminSubmit}
                                disabled={isCommandRunning}
                                className="flex-1 text-xl bg-transparent outline-none text-white"
                                placeholder="Enter command..."
                            />
                            {isCommandRunning && (
                                <i className="ri-loader-4-line animate-spin text-gray-500"></i>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// ============================================================================
// 🧩 COMPONENT 1: MONACO EDITOR PANEL
// ============================================================================
const MonacoEditorPanel = ({ code, setCode }) => {
    return (
        <div className="flex-1 min-h-0 overflow-hidden">
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
    );
};


const CodeEditor = () => {
    const getInitialCode = () => {
        const saved = localStorage.getItem("activeChallenge");
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.editorLayoutText;
        }
        return "// Welcome! Click the '+' button to fetch your daily AI challenge.";
    };

    let userInfo = useUser();
    console.log(userInfo);
    const [user, SetUser] = useState({ name: userInfo?.user?.name || "", role: userInfo?.user?.role || 'user', isAdmin: userInfo?.user?.role == 'admin' ? true : false });
    console.log(user);
    const [code, setCode] = useState(getInitialCode());
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiReviewData, setAiReviewData] = useState(null);

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

    const [consoleHeight, setConsoleHeight] = useState(160);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight >= 60 && newHeight <= window.innerHeight - 120) {
                setConsoleHeight(newHeight);
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const runCode = async () => {
        try {
            const result = await axios.post(`${DBURL}/code/run`, { code });
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

    const handleGenerateNewQuestion = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("authToken");

            const response = await axios.get(`${DBURL}/codeflow/genarate`, {
                withCredentials: true,
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });

            if (response.data && response.data.success) {
                const challenge = response.data.data;
                const formattedLayout = `/**
 * CHALLENGE: ${challenge.title}
 * CONTEXT:   ${challenge.contextDomain}
 * FOCUS:     ${challenge.technicalFocus}
 * * DESCRIPTION:
 * ${challenge.description}
 */

${challenge.starterCode || "// Write your solution logic below\n"}`;

                localStorage.setItem("activeChallenge", JSON.stringify({
                    ...challenge,
                    editorLayoutText: formattedLayout
                }));

                setCode(formattedLayout);
            }
        } catch (error) {
            console.error("Failed to sync AI pipeline question:", error);
            toast.error(error.response?.data?.message || "Authentication missing or session expired.");
        } finally {
            setIsLoading(false);
        }
    };

    const submitAnswer = async () => {
        try {
            const activeChallengeRaw = localStorage.getItem("activeChallenge");
            if (!activeChallengeRaw) {
                toast.error("Please generate a problem profile first before submitting solutions.");
                return;
            }
            const activeChallenge = JSON.parse(activeChallengeRaw);

            setIsSubmitting(true);
            const token = localStorage.getItem("authToken");

            const response = await axios.post(`${DBURL}/codeflow/submit`, {
                quesitonId: activeChallenge.questionId,
                code: code
            }, {
                withCredentials: true,
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });

            if (response.data && response.data.success) {
                setAiReviewData(response.data.data.review);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Submission error encountered:", error);
            toast.error(error.response?.data?.message || "Submission lifecycle processing failure.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const savedChallenge = localStorage.getItem("activeChallenge");
        const baselineText = savedChallenge
            ? JSON.parse(savedChallenge).editorLayoutText
            : "// Welcome! Click the '+' button to fetch your daily AI challenge.";
        setIsUserWriteCode(code.trim() !== baselineText.trim());
    }, [code]);

    return (
        <div
            className="w-full h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden"
            style={{ userSelect: isDragging ? 'none' : 'auto' }}
        >
            <MonacoEditorPanel code={code} setCode={setCode} />

            <div
                onMouseDown={() => setIsDragging(true)}
                className={`w-full h-1.5 cursor-ns-resize select-none transition-colors z-20 ${isDragging ? "bg-sky-500 shadow-md" : "bg-gray-800 hover:bg-sky-600/50"
                    }`}
            />

            <ConsoleTerminalPanel
                consoleHeight={consoleHeight}
                output={output}
                isUserWriteCode={isUserWriteCode}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                onRunCode={runCode}
                isAdmin={user.isAdmin}
                onSubmitAnswer={submitAnswer}
                onGenerateNewQuestion={handleGenerateNewQuestion}
                onOpenLogin={() => setIsLoginScreen(true)}
            />

            <CertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reviewData={aiReviewData}
                userName={user.name}
            />

            {isLoginScreen && (
                <Login
                    setIsLoginScreen={setIsLoginScreen}
                    isLoginScreen={isLoginScreen}
                    onLoginSuccess={() => { }}
                />
            )}

            <LeaderBoard />
        </div>
    );
};

export default CodeEditor;