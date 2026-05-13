import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditor = () => {

    const starterCode = `
// Question:
// Create a function named sum
// that returns addition of two numbers.

// Example:
// sum(5, 10)
// Output: 15

function sum(a, b){

}
`;

    const [code, setCode] = useState(starterCode);

    const [output, setOutput] = useState([]);

    // execute code
    const runCode = async () => {

        try {

            const response = await fetch("http://localhost:3000/code/run", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    code,
                }),
            });

            const data = await response.json();

            console.log("Execution Result:", data);

            if (data.success) {

                const finalOutput = [];

                // output
                if (data.output) {

                    finalOutput.push({
                        type: "output",
                        value: data.output
                    });

                }

                // logs
                if (data.logs?.length > 0) {

                    data.logs.forEach((log) => {

                        try {

                            const parsed = JSON.parse(log);

                            finalOutput.push({
                                type: "json",
                                value: parsed
                            });

                        } catch {

                            finalOutput.push({
                                type: "text",
                                value: log
                            });

                        }

                    });

                }

                setOutput(finalOutput);

            } else {

                setOutput([
                    {
                        type: "error",
                        value: data.error
                    }
                ]);

            }

        } catch (error) {

            setOutput([
                {
                    type: "error",
                    value: error.message
                }
            ]);

        }
    };

    // submit answer
    const submitAnswer = () => {

        console.log("Submitted Code:", code);

        alert("Answer Submitted!");

    };

    return (

        <div className="w-full h-screen bg-[#0f172a] text-white flex flex-col">

            {/* top bar */}
            <div className="w-full p-4 border-b border-gray-700 flex items-center gap-4">

                <button
                    onClick={runCode}
                    className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                >
                    Run Code
                </button>

                <button
                    onClick={submitAnswer}
                    className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Submit
                </button>

            </div>

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
                            enabled: false,
                        },

                        automaticLayout: true,

                        scrollBeyondLastLine: false,

                        wordWrap: "on",

                        fontFamily: "JetBrains Mono",

                        fontLigatures: true,

                        smoothScrolling: true,
                    }}
                />

            </div>

            {/* output */}
            <div className="h-56 bg-black p-4 overflow-auto border-t border-gray-700">

                <h2 className="text-green-400 mb-3">
                    Console Output
                </h2>

                <div className="space-y-3">

                    {
                        output.map((item, index) => {

                            // json
                            if (item.type === "json") {

                                return (
                                    <pre
                                        key={index}
                                        className="text-blue-400 text-sm whitespace-pre-wrap"
                                    >
                                        {JSON.stringify(item.value, null, 2)}
                                    </pre>
                                );
                            }

                            // error
                            if (item.type === "error") {

                                return (
                                    <p
                                        key={index}
                                        className="text-red-400 text-sm"
                                    >
                                        {item.value}
                                    </p>
                                );
                            }

                            // output
                            if (item.type === "output") {

                                return (
                                    <p
                                        key={index}
                                        className="text-yellow-400 text-sm"
                                    >
                                        OUTPUT: {item.value}
                                    </p>
                                );
                            }

                            // normal text
                            return (
                                <p
                                    key={index}
                                    className="text-green-400 text-sm"
                                >
                                    {item.value}
                                </p>
                            );

                        })
                    }

                </div>

            </div>

        </div>
    );
};

export default CodeEditor;