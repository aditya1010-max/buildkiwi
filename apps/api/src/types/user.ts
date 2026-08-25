export interface User {
  id: string;

  username: string;

  email: string;

  passwordHash: string;

  avatarUrl?: string;

  bio?: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
}
