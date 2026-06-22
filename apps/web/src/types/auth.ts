export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

// export interface RegisterResponse {
//     success: boolean;
//     user: User;
// }
