// import cron from "node-cron";
// import {generateLocalYearlyQuestion} from "../utils/topics.js"

// const autoGenerateJSQuestion = async () => {
//     try {
//         const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
//         const defaultJSQuestion = {
//             title: `JavaScript Daily Challenge for ${today}`,
//             createdAt: new Date(), // This binds it directly to your calendar range filter
//             answers: []
//         };


//         // const deployedQuestion = await Question.create(defaultJSQuestion);
//         // console.log(`[CRON SUCCESS] Daily automation injected question ID: ${defaultJSQuestion}`);
        
//         // return deployedQuestion;
//     } catch (error) {
//         console.error("[CRON ERROR] Failed to automatically run morning task:", error);
//     }
// };

// cron.schedule("* * * * *", async () => {
//     console.log("⏰ Clock hit 06:00 AM. Initiating automatic JavaScript generation loop...");
//     await autoGenerateJSQuestion();
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata" // ⚠️ CRITICAL: Set this to your local server/user timezone (e.g., "America/New_York", "UTC", etc.)
// });

// export default autoGenerateJSQuestion