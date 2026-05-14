import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios"

const CodeEditor = () => {


    let starterCode = "//hello"
    const [code, setCode] = useState(starterCode);
    const [output, setOutput] = useState([]);
    const [error, setError] = useState();
  
    // execute code
    const runCode = async () => {
        try {
            let result = await axios.post(`http://localhost:3000/code/run`, {
                code
            })
            if (result.data.success) {
                let serverOutput = result.data?.data?.logs;
                setOutput(serverOutput)
            } else {

            }
        } catch (error) {

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
                        <button
                            onClick={runCode}
                            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-all"
                        >
                            <i className="ri-play-fill"></i>
                            Run
                        </button>
                        {/* submit button */}
                        <button
                            onClick={submitAnswer}
                            className="flex cursor-pointer items-center gap-2 px-4 py-2  rounded-lg text-sm transition-all"
                        >
                            <i className="ri-upload-2-fill"></i>
                            Submit
                        </button>

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
                            output.length === 0 &&  (
                                <p className="text-gray-500 text-sm">
                                    Run your code to see output...
                                </p>
                            )
                        }
                        {
                            output?.map((op) => (
                                <div>{op}</div>
                            ))
                        }

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CodeEditor;