import { User } from "../models/user.model";

import type { CreateUserData, UpdateUserProfileData } from "../types/user";
import { AppError } from "../utils/AppError";

export const createUserRepository = (data: CreateUserData) => {
  return User.create(data);
};

export const findUserByEmailRepository = (email: string) => {
  return User.findOne({ email });
};

export const findUserByIdRepository = (id: string) => {
  return User.findById(id).select("-passwordHash -__v");
};

export const findPublicUserByUsernameRepository = (username: string) => {
  return User.findOne({ username }).select(
    "_id username avatarSeed avatarPattern bio createdAt",
  );
};

export const saveProjectRepository = (userId: string, projectId: string) => {
  return User.findByIdAndUpdate(
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

export const unsaveProjectRepository = (userId: string, projectId: string) => {
  return User.findByIdAndUpdate(
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
    throw new AppError("User not found", 404);
  }

  await user.populate({
    path: "savedProjects",
    populate: {
      path: "creatorId",
      select: "username avatarSeed avatarPattern",
    },
  });

  return user.savedProjects;
};

export const updateUserProfileRepository = (
  userId: string,
  data: UpdateUserProfileData,
) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  ).select("-passwordHash -__v");
};
