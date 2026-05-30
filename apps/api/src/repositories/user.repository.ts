import { User } from "../models/user.model";

export const createUserRepository = async (data: any) => {
  //replace any later
  return await User.create(data);
};

export const findUserByEmailRepository = async (email: string) => {
  // Consider .lean() later
  return await User.findOne({ email });
};

export const findUserByIdRepository = async (id: string) => {
  // Consider .lean() later
  return await User.findById(id);
};
