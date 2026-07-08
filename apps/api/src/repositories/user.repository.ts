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
