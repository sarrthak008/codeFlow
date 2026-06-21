import { Schema, model } from "mongoose";

const answerSchema = new Schema({
    text: {
        type: String,
        required: [true, "Answer content cannot be empty"],
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "An answer must belong to a user"]
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "An answer must be linked to a question"]
    },
    codeFlowAI: {
        type: Schema.Types.Mixed,
        required: true
    },

}, {timestamps: true });


answerSchema.index({ user: 1, question: 1 }, { unique: true });
export const Answer = model("Answer", answerSchema);