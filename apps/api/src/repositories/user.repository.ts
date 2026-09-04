import { User } from "../models/user.model";

import type { CreateUserData, UpdateUserProfileData } from "../types/user";

export const createUserRepository = async (data: CreateUserData) => {
  return User.create(data);
};

export const findUserByEmailRepository = async (email: string) => {
  return User.findOne({ email });
};

export const findUserByIdRepository = async (id: string) => {
  return User.findById(id).select("-passwordHash -__v");
};

export const saveProjectRepository = async (
  userId: string,
  projectId: string,
) => {
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

export const unsaveProjectRepository = async (
  userId: string,
  projectId: string,
) => {
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
    throw new Error("User not found");
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

export const updateUserProfileRepository = async (
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
