import { adduser } from "./helper/user_cmd.js";

const executeCommand = async (input) => {
    const [commandName, ...parameters] = input.trim().split(/\s+/);
    
    switch (commandName) {
       
        case "adduser":
            return await adduser(parameters);
            
        case "help":
            return `Available Commands: - adduser name pass`;
        default:
            return `Command not found: ${commandName}`;
    }
};

export default executeCommand;