import { VM } from "vm2";
import responder from "../utils/responder.js";

const executeJs = async (req, res) => {
    const { code } = req.body;
    console.log(code)
    if (!code) {
        return responder(res, 404, null, false, 'please add code');
    }

    const logs = [];

    const vm = new VM({
        timeout: 3000,
        allowAsync: true,
        sandbox: {
            console: {
                log: (...args) => {
                    logs.push(args.join(" "));
                },
            },

            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval,

            fetch,
        },
    });

    try {
        const wrappedCode = `
      (async () => {
        ${code}
      })()
    `;

        const result = await vm.run(wrappedCode);

        return responder(res, 200, {
            output: result,
            logs
        }, true, "here is your output");

    } catch (error) {
        return responder(res, 500, {
            error: error.message,
            logs
        }, false, error);
    }
};

export { executeJs };