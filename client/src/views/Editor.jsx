import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios"

const ServerClientStatusHighlighter = ({ clientI = false, serverI = false }) => {
    console.log(clientI, serverI)
    return (
        <div className="flex gap-4 opacity-50">
            Server : <span className="flex items-center">{serverI ? <div className="h-[10px] w-[10px] rounded-full bg-red-500"></div> :
                <div className="h-[10px] w-[10px] rounded-full bg-green-500"></div>
            }</span>

            Client : <span className="flex items-center">{clientI ? <div className="h-[10px] w-[10px] rounded-full bg-red-500"></div> :
                <div className="h-[10px] w-[10px] rounded-full bg-green-500"></div>
            }</span>
        </div>
    )
}


const CodeEditor = () => {


    let starterCode = "//hello"
    const [code, setCode] = useState(starterCode);
    const [output, setOutput] = useState({});
    const [isUserWriteCode, setIsUserWriteCode] = useState(false);

    const runCode = async () => {
        setIsUserWriteCode(code.trim() !== starterCode.trim())

        try {
            const result = await axios.post("http://localhost:3000/code/run", { code });
            console.log(result);
            setOutput({
                isSuccess: true,
                isClientIessue: false,
                output: result?.data?.data?.output,
                logs: result?.data?.data?.logs,
                error: null,
            });

        } catch (error) {
            console.log(error);
            // SERVER ERROR RESPONSE
            if (error.response) {
                setOutput({
                    isSuccess: false,
                    isClientIessue: false,
                    output: error?.response?.data?.data?.error || "Execution Error",
                    logs: error?.response?.data?.data?.logs || [],
                    error: error?.response?.data?.message || "Server Error",
                });

            }
            // NETWORK ERROR
            else {
                setOutput({
                    isSuccess: false,
                    isClientIessue: true,
                    output: error.message || "Network Error",
                    logs: [],
                    error: "Cannot connect to server",
                });
            }
        }
    };

    // submit answer
    const submitAnswer = () => {
        console.log("Submitted Code:", code);
        alert("Answer Submitted!");
    };

    return (
        <div className="w-full h-screen bg-[#0f172a] text-white flex flex-col">
            {/* editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    onChange={(value) => setCode(value)}
                    options={{
                        fontSize: 16,
                        minimap: {
                            enabled: true,
                        },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        fontFamily: "JetBrains Mono",
                        fontLigatures: true,
                        smoothScrolling: true,
                        padding: {
                            top: 10,
                        },
                    }}
                />

            </div>
            {/* console output */}
            <div className="h-40 bg-black border-t border-gray-800 flex flex-col">
                {/* console top bar */}
                <div className="w-full px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="text-green-400 font-medium flex items-center gap-2">
                        <i className="ri-terminal-box-line"></i>
                        Console Output
                    </h2>
                    <div className="flex items-center gap-3">
                        <span>
                            <ServerClientStatusHighlighter clientI={output.isClientIessue} serverI={output.isSuccess} />
                        </span>
                        {
                            isUserWriteCode ?
                                <button
                                    onClick={runCode}
                                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-all"
                                >
                                    <i className="ri-play-fill"></i>
                                    Run
                                </button> : <button
                                    disabled
                                    className="flex text-gray-400  cursor-not-allowed items-center gap-2 px-4 py-2 text-sm transition-all"
                                >
                                    <i className="ri-play-fill"></i>
                                    Run
                                </button>
                        }

                        {
                            isUserWriteCode ?
                                <button
                                    onClick={submitAnswer}
                                    className="flex cursor-pointer items-center gap-2 px-4 py-2  rounded-lg text-sm transition-all"
                                >
                                    <i className="ri-upload-2-fill"></i>
                                    Submit
                                </button> :
                                <button
                                    className="flex  text-gray-400 cursor-not-allowed items-center gap-2 px-4 py-2  rounded-lg text-sm transition-all"
                                >
                                    <i className="ri-upload-2-fill"></i>
                                    Submit
                                </button>
                        }

                        {/* clear console */}
                        <button
                            onClick={() => setOutput([])}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] hover:bg-red-600 transition-all"
                        >
                            <i className="ri-delete-bin-6-line text-lg"></i>
                        </button>

                    </div>

                </div>

                {/* console body */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="space-y-3">
                        {
                            output.isSuccess ?
                                <div>
                                    <p>Result: {output?.output}</p>
                                    <div>
                                        {output?.logs?.map((op) => (
                                            <div>{op}</div>
                                        ))}
                                    </div>
                                </div> : <div>
                                    {
                                        <>
                                            <span className="text-red-400">{output.output}</span>
                                        </>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;