import { VM } from "vm2";
import responder from "../utils/responder.js";

// YOUR ALLOWED API
const ALLOWED_BASE_URL = "https://your-api.com";

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err.message);
});

process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
});

const executeJs = async (req, res) => {
    try {

        const { code } = req.body;

        if (!code || typeof code !== "string") {
            return responder(
                res,
                400,
                null,
                false,
                "Please provide valid code"
            );
        }

        if (code.length > 5000) {
            return responder(
                res,
                400,
                null,
                false,
                "Code too large"
            );
        }

        const logs = [];

        // SAFE CONSOLE
        const safeConsole = {
            log: (...args) => {
                try {

                    const msg = args
                        .map((arg) => {
                            if (typeof arg === "object") {
                                return JSON.stringify(arg);
                            }

                            return String(arg);
                        })
                        .join(" ");

                    logs.push(msg);

                    if (logs.length > 100) {
                        logs.shift();
                    }

                } catch {
                    logs.push("[Log Error]");
                }
            },
        };

        // SAFE FETCH
        const safeFetch = async (url, options = {}) => {

            try {

                // Allow only your API
                if (!url.startsWith(ALLOWED_BASE_URL)) {
                    throw new Error("Only internal API allowed");
                }

                // Timeout controller
                const controller = new AbortController();

                const timeout = setTimeout(() => {
                    controller.abort();
                }, 3000);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                });

                clearTimeout(timeout);

                // limit returned data
                const text = await response.text();

                if (text.length > 10000) {
                    throw new Error("Response too large");
                }

                return {
                    ok: response.ok,
                    status: response.status,

                    json: async () => JSON.parse(text),

                    text: async () => text,
                };

            } catch (err) {
                throw new Error(err.message);
            }
        };

        const vm = new VM({
            timeout: 5000,
            eval: false,
            wasm: false,
            allowAsync: true,

            sandbox: {
                console: safeConsole,
                fetch: safeFetch,

                Math,
                Date,

                process: undefined,
                require: undefined,
                global: undefined,
                globalThis: undefined,
                Buffer: undefined,
                module: undefined,
                exports: undefined,

                setTimeout: undefined,
                setInterval: undefined,
                setImmediate: undefined,
            },
        });

        const wrappedCode = `
            "use strict";

            (async () => {
                ${code}
            })()
        `;

        let result;

        try {

            result = await vm.run(wrappedCode);

        } catch (err) {

            return responder(
                res,
                400,
                {
                    error: err.message,
                    logs,
                },
                false,
                "Execution failed"
            );
        }

        let safeResult;

        try {

            if (typeof result === "object") {
                safeResult = JSON.stringify(result);
            } else {
                safeResult = result;
            }

        } catch {
            safeResult = "[Cannot serialize result]";
        }

        return responder(
            res,
            200,
            {
                output: safeResult,
                logs,
            },
            true,
            "Executed successfully"
        );

    } catch (err) {

        console.error("SERVER ERROR:", err);

        return responder(
            res,
            500,
            {
                error: "Internal server error"
            },
            false,
            "Server handled safely"
        );
    }
};

export { executeJs };