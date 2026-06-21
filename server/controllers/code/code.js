import { generateLocalYearlyQuestion } from "../../utils/topics.js";
import responder from "../../utils/responder.js";
import { Question } from "../../models/question.model.js";
import useAI from "../../config/ai.js";

const genarateQuestions = async (req, res) => {
    try {
        // 1. Extract and Validate User
        let reqUser = req.user;
        if (!reqUser) {
            return responder(res, 400, {}, false, "Please Login or report bug");
        }
        const userId = reqUser._id;
        const testIndex = 0;
        const localSourceData = generateLocalYearlyQuestion(testIndex);

        const strictSystemPrompt = `
            Generate a unique JavaScript programming challenge based on this structural configuration: ${JSON.stringify(localSourceData)}.
            
            You must return ONLY a raw, unquoted JSON object matching this exact schema layout structure:
            {
                "title": "A short descriptive title for the challenge",
                "description": "Clear step-by-step instructions on what code to write and what console.log should output.",
                "expectedOutput": "The exact string output that console.log should print"
            }

            Constraints:
            - Do not use markdown format tags like \`\`\`json.
            - Return only raw unformatted string text data matching the schema keys.
        `;

        // 2. Fetch AI Response text string wrapper
        let aiResponse = await useAI(strictSystemPrompt);
        let rawJsonString = "";

        // Unpack from nested object wrappers if present
        if (typeof aiResponse === "object" && aiResponse.result) {
            rawJsonString = aiResponse.result;
        } else if (typeof aiResponse === "string") {
            rawJsonString = aiResponse;
        } else {
            rawJsonString = JSON.stringify(aiResponse);
        }

        // 3. 🛡️ SAFEST EXTRACTION METHOD: Isolate the pure JSON block {...}
        const jsonMatch = rawJsonString.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain a valid JSON block format structure");
        }
        
        let cleanJsonString = jsonMatch[0];

        // Replace any accidental bad character escaping sequences if they exist
        cleanJsonString = cleanJsonString
            .replace(/\\'/g, "'") // Fixes raw escaped single quotes (\')
            .replace(/\n/g, " ")  // Replaces harsh structural line breaks with safe spaces
            .replace(/\r/g, "");

        // 4. Parse the sanitized JSON string cleanly
        const parsedAIQuestion = JSON.parse(cleanJsonString);

        // 5. Store cleanly into Mongoose
        const savedQuestion = await Question.create({
            title: parsedAIQuestion.title, 
            userId: userId                 
        });

        // 6. Return response to client playground view tracking canvas
        return responder(
            res,
            200,
            {
                questionId: savedQuestion._id,
                userId: savedQuestion.userId,
                title: savedQuestion.title, 
                description: parsedAIQuestion.description, 
                starterCode: localSourceData.starterCode,   
                technicalFocus: localSourceData.technicalFocus,
                contextDomain: localSourceData.contextDomain
            },
            true,
            "Question generated and saved for user successfully"
        );

    } catch (error) {
        console.error("ERROR GENERATING AND STORING QUESTION:", error);
        return responder(
            res,
            500,
            { error: error.message },
            false,
            `Internal server parse loop failed: ${error.message}`
        );
    }
};

export { genarateQuestions };