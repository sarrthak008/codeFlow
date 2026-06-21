const baseTechnicalTopics = [
    { title: "Printing text strings using console.log", starter: "console.log('Hello World');", output: "Hello World" },
    { title: "Declaring variables with let for changing data", starter: "let dynamicValue = 10;\ndynamicValue = 20;\nconsole.log(dynamicValue);", output: "20" },
    { title: "Declaring constant values with const", starter: "const staticFlag = 'Active';\nconsole.log(staticFlag);", output: "Active" },
    { title: "Combining text using template literals", starter: "const tag = 'User';\nconsole.log(`Current: ${tag}`);", output: "Current: User" },
    { title: "Basic numeric addition and subtraction", starter: "let total = 100 + 50 - 25;\nconsole.log(total);", output: "125" },
    { title: "Numeric multiplication and division", starter: "let scale = (10 * 5) / 2;\nconsole.log(scale);", output: "25" },
    { title: "Finding remainders with the modulo operator (%)", starter: "let remainder = 15 % 4;\nconsole.log(remainder);", output: "3" },
    { title: "Incrementing counters using plus-plus (++)", starter: "let score = 5;\nscore++;\nconsole.log(score);", output: "6" },
    { title: "Using compound assignment operations (+=)", starter: "let balance = 200;\nbalance += 50;\nconsole.log(balance);", output: "250" },
    { title: "Comparing values with strict equality (===)", starter: "console.log(10 === '10');", output: "false" },
    { title: "Checking difference with strict inequality (!==)", starter: "console.log(5 !== 10);", output: "true" },
    { title: "Using greater-than and less-than relational flags", starter: "console.log(45 > 50);", output: "false" },
    { title: "Writing a fundamental single-condition if block", starter: "let status = true;\nif(status) {\n   console.log('Passed');\n}", output: "Passed" },
    { title: "Providing an alternate fallback route using else", starter: "let level = 5;\nif(level > 10) {\n   console.log('High');\n} else {\n   console.log('Low');\n}", output: "Low" },
    { title: "Chaining sequential checks with else-if paths", starter: "let score = 75;\nif(score > 90) { console.log('A'); } else if(score > 70) { console.log('B'); } else { console.log('C'); }", output: "B" },
    { title: "Enforcing multiple criteria with logical AND (&&)", starter: "let active = true;\nlet admin = true;\nconsole.log(active && admin);", output: "true" },
    { title: "Enforcing flexible options with logical OR (||)", starter: "let guest = true;\nlet member = false;\nconsole.log(guest || member);", output: "true" },
    { title: "Inverting boolean truths with the logical NOT operator (!)", starter: "let visible = false;\nconsole.log(!visible);", output: "true" },
    { title: "Writing clean conditional ternary shortcuts", starter: "let age = 20;\nconsole.log(age >= 18 ? 'Adult' : 'Minor');", output: "Adult" },
    { title: "Running incremental loops with the for keyword", starter: "let count = 0;\nfor(let i=0; i<3; i++) { count += i; }\nconsole.log(count);", output: "3" },
    { title: "Iterating countdowns backward to zero using for loops", starter: "let log = '';\nfor(let i=3; i>0; i--) { log += i; }\nconsole.log(log);", output: "321" },
    { title: "Running baseline conditional shifts inside while loops", starter: "let step = 0;\nwhile(step < 2) { step++; }\nconsole.log(step);", output: "2" },
    { title: "Creating clean structural list items with arrays", starter: "const catalog = ['A', 'B'];\nconsole.log(catalog[0]);", output: "A" },
    { title: "Accessing target array components using index locations", starter: "const point = [100, 200, 300];\nconsole.log(point[2]);", output: "300" },
    { title: "Evaluating internal counts with the array.length property", starter: "const stack = [1, 2, 3, 4];\nconsole.log(stack.length);", output: "4" },
    { title: "Appending trailing dataset elements using array.push()", starter: "const list = [10];\nlist.push(20);\nconsole.log(list.length);", output: "2" },
    { title: "Dropping tail dataset elements using array.pop()", starter: "const collection = ['X', 'Y'];\ncollection.pop();\nconsole.log(collection[0]);", output: "X" },
    { title: "Building simple property maps inside objects", starter: "const data = { id: 101 };\nconsole.log(data.id);", output: "101" },
    { title: "Reading target object states using dot notation keys", starter: "const stats = { speed: 80 };\nconsole.log(stats.speed);", output: "80" },
    { title: "Modifying nested data values inside an active object", starter: "const config = { mode: 'dark' };\nconfig.mode = 'light';\nconsole.log(config.mode);", output: "light" },
    { title: "Nesting structural child objects inside a parent key", starter: "const app = { user: { name: 'Dev' } };\nconsole.log(app.user.name);", output: "Dev" },
    { title: "Grouping multiple objects inside a standard array layout", starter: "const registry = [{id: 1}, {id: 2}];\nconsole.log(registry[1].id);", output: "2" },
    { title: "Inspecting all existing object keys via for-in loops", starter: "const item = { x: 1, y: 2 };\nlet keys = '';\nfor(let k in item) { keys += k; }\nconsole.log(keys);", output: "xy" },
    { title: "Iterating directly through array items with for-of structures", starter: "const numbers = [10, 20];\nlet total = 0;\nfor(let n of numbers) { total += n; }\nconsole.log(total);", output: "30" },
    { title: "Passing unique variable arguments into function blocks", starter: "function process(v) { console.log(v * 2); }\nprocess(5);", output: "10" },
    { title: "Passing output signals using explicit return statements", starter: "function calc() { return 50 - 10; }\nconsole.log(calc());", output: "40" },
    { title: "Writing modern compact arrow functions for basic tasks", starter: "const check = () => 'Verified';\nconsole.log(check());", output: "Verified" },
    { title: "Isolating operations using secure try block wrappers", starter: "try {\n   console.log('Safe execution loop');\n} catch(e) {}", output: "Safe execution loop" },
    { title: "Intercepting code crashes using backup catch parameters", starter: "try {\n   throw new Error('Forced crash');\n} catch(err) {\n   console.log('Intercepted!');\n}", output: "Intercepted!" },
    { title: "Reading exact breakdown details using error.message metrics", starter: "try {\n   throw new Error('System Alert');\n} catch(err) {\n   console.log(err.message);\n}", output: "System Alert" }
];

const applicationDomains = [
    "E-Commerce Checkout Tracker", "RPG Video Game Analytics", "Social Media Activity Feed",
    "Fitness Daily Step Monitor", "Smart Home Automation Grid", "Food Delivery Dispatch Loop",
    "Streaming Video Playlist", "Hotel Reservation Index", "Crypto Ledger Balance Sheet",
    "Kanban Project Task Board", "Ride-Sharing Pricing Calculator", "School Exam Gradebook"
];

export const generateLocalYearlyQuestion = (dayIndex) => {
    const validatedIndex = Math.abs(parseInt(dayIndex)) || 0;
    const baseTopic = baseTechnicalTopics[validatedIndex % baseTechnicalTopics.length];
    const domainContext = applicationDomains[validatedIndex % applicationDomains.length];

    const currentDay = validatedIndex + 1;

    return {
        success: true,
        day: currentDay,
        topicOrderIndex: validatedIndex,
        title: `Day ${currentDay} Challenge: ${domainContext}`,
        description: `Implement code to practice: ${baseTopic.title}. Modify the data parameters within the context of an active ${domainContext} structure to return the expected console logs.`,
        technicalFocus: baseTopic.title,
        contextDomain: domainContext,
        starterCode: baseTopic.starter,
        expectedOutput: baseTopic.output
    };
};