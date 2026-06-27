import { generateLocalYearlyQuestion } from "../../utils/topics.js";
import responder from "../../utils/responder.js";
import { Question } from "../../models/question.model.js";
import { Answer } from "../../models/answer.model.js";
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
            codeFlowAiData : parsedAIQuestion,
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


const submitAnswer = async (req, res) => {
    try {
        let reqUser = req.user;
        if (!reqUser) {
            return responder(res, 400, {}, false, "Please Login or report bug");
        }
        const userId = reqUser._id;

        let { quesitonId, code } = req.body; 
        const questionId = quesitonId;

        if (!questionId || !code) {
            return responder(res, 400, {}, false, "Invalid payload context. Missing question or code submission.");
        }

        let findedQuestion = await Question.findById(questionId);
        if (!findedQuestion) {
            return responder(res, 404, {}, false, "Target challenge assignment not found!");
        }

        const reviewPrompt = `
            You are an expert JavaScript Code Reviewer. Review the user's submitted solution code against the challenge criteria.
            
            Challenge Data: ${findedQuestion?.parsedAIQuestion}
            
            User's Submitted Code:
            ${code}

            Provide actionable feedback and tips. You must return ONLY a raw, unquoted JSON object matching this structural schema layout:
            {
                "status": "Passed" or "Failed",
                "score": "A string rating from 0 to 100 based on optimization, logic, and clean practices",
                "feedback": "A concise summary of their solution structure",
                "correctCode :  the correct answer for given problem
                "tips": [
                    "Tip 1 regarding code improvement or edge case coverage",
                    "Tip 2 regarding syntax style optimization or performance"
                ]
            }

            Constraints:
            - Do not return markdown wrappers like \`\`\`json or trailing commentary.
            - Ensure syntax formatting inside the fields avoids escaping conflicts.
        `;

        // 5. Fetch code review breakdown tracking structure from AI
        let aiResponse = await useAI(reviewPrompt);
        let rawJsonString = "";

        // Unpack if wrapped inside custom service object structures
        if (typeof aiResponse === "object" && aiResponse.result) {
            rawJsonString = aiResponse.result;
        } else if (typeof aiResponse === "string") {
            rawJsonString = aiResponse;
        } else {
            rawJsonString = JSON.stringify(aiResponse);
        }

        // 6. Robust JSON regex block extraction safeguard
        const jsonMatch = rawJsonString.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI review pipeline did not yield a valid evaluation JSON architecture template.");
        }

        let cleanJsonString = jsonMatch[0]
            .replace(/\\'/g, "'")
            .replace(/\n/g, " ")
            .replace(/\r/g, "");

        const parsedAIReview = JSON.parse(cleanJsonString);

        // 7. Store or update the submission directly into your Answer Schema database model
        // Using upsert (findOneAndUpdate) to comply seamlessly with your compound unique index constraint
        const recordedAnswer = await Answer.findOneAndUpdate(
            { user: userId, question: questionId },
            {
                text: code,                    // Maps directly to your 'text' string tracker field
                user: userId,                  // Object reference
                question: questionId,          // Object reference
                codeFlowAI: parsedAIReview     // Mixed object structure populated dynamically by AI
            },
            { new: true, upsert: true }        // Overwrites cleanly if they re-submit their challenge solution
        );

        // 8. Track and update reference lookup parameters on the parent question schema instance
        if (!findedQuestion.answers.includes(recordedAnswer._id)) {
            findedQuestion.answers.push(recordedAnswer._id);
            await findedQuestion.save();
        }

        // 9. Return the review successfully
        return responder(
            res,
            200,
            {
                answerId: recordedAnswer._id,
                text: recordedAnswer.text,
                review: recordedAnswer.codeFlowAI
            },
            true,
            "Solution processed, reviewed by AI, and stored successfully."
        );

    } catch (error) {
        console.error("CRITICAL EXCEPTION RUNNING AI SUBMISSION EVALUATOR:", error);
        return responder(
            res,
            500,
            { error: error.message },
            false,
            `Code submission processing lifecycle failed: ${error.message}`
        );
    }
};



const getLeaderBoard = async (req, res) => {
    try {

        const leaderboard = await Answer.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalMarks: {
                        $sum: {
                            $toInt: "$codeFlowAI.score"
                        }
                    },
                    totalSolved: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalMarks: -1
                }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users", // Mongo collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    totalMarks: 1,
                    totalSolved: 1
                }
            }
        ]);

        return responder(
            res,
            200,
            leaderboard,
            true,
            "Leaderboard fetched successfully."
        );

    } catch (error) {

        console.log(error);

        return responder(
            res,
            500,
            { error: error.message },
            false,
            "Failed to fetch leaderboard."
        );
    }
};


export { genarateQuestions , submitAnswer ,getLeaderBoard};