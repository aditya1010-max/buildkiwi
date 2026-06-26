//this will call login , store token , store user , logout

import { useState } from "react";
import { login, register } from "../api/auth.api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await login(email, password);

      localStorage.setItem("token", response.token);

      localStorage.setItem("user", JSON.stringify(response.user));

      return response.user;
    } catch (err) {
      setError("Invalid email or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await register(username, email, password);

      return response.user;
    } catch (err) {
      setError("Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return {
    loginUser,
    registerUser,
    logout,
    getCurrentUser,
    getToken,
    loading,
    error,
  };
};
