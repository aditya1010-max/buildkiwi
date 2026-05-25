import { Project } from "../models/project.models"

export const createProjectService = async (type: string, data: any) => {
    return await Project.create({ type, data});
}

export const getProjectsService = async () => {
    return await Project.find().sort({ createdAt: -1});
}