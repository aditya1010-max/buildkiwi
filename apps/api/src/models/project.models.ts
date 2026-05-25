import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Project = mongoose.model("Project", projectSchema);

