import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"] 
    },

    submittedAnswers: [{
        type: Schema.Types.ObjectId, 
        ref: "Answer" 
    }],

    role: {
        type: String,
        enum: ["user", "admin", "ai"], 
        default: "user"
    },
    codeIndex : {
        type:Number ,
        default : 0
    }
}, { timestamps: true });

export const User = model("User", userSchema);