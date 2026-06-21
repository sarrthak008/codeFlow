import { Schema, model } from "mongoose";

const questionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Question title is required"],
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"]
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: "Answer"
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Question = model("Question", questionSchema);