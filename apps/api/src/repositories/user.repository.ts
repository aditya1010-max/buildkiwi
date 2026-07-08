import { User } from "../models/user.model";
// import { RegisterInput } from "packages/validation/src/auth.schema";

interface CreateUserData {
  //maybe create similar interface for login and register input data
  username: string;
  email: string;
  passwordHash: string;
}

export const createUserRepository = async (data: CreateUserData) => {
  return await User.create(data);
};

export const findUserByEmailRepository = async (email: string) => {
  // Consider .lean() later
  return await User.findOne({ email });
};

export const findUserByIdRepository = async (id: string) => {
  // Consider .lean() later
  return await User.findById(id).select("-passwordHash -__v");
};

export const saveProjectRepository = async ( userId: string, projectId: string ) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        savedProjects: projectId,
      },
    },
    {
      new: true,
    },
  );
};

export const unsaveProjectRepository = async (userId: string, projectId: string ) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        savedProjects: projectId,
      },
    },
    {
      new: true,
    },
  );
};

export const getSavedProjectsRepository = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.populate("savedProjects");
  return user.savedProjects;
};
