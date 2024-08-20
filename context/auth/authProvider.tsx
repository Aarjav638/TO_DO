// AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { setAuthToken } from "../axiosConfig";
import AuthContext, { User } from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (token && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setAuthToken(token);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // console.log("emial", email, "password", password);
    try {
      setLoading(true);
      const response = await axios.post("auth/login", { email, password });
      // console.log(response.data);

      const { success, token, user: userData, message } = await response.data;
      const parsedUser: User = await userData;
      await setUser(parsedUser);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
      setAuthToken(token);
      setSuccess(success);
      setMessage(message);
    } catch (err) {
      setLoading(false);
      console.log((err as any)?.response?.data?.message);
      setMessage((err as any)?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post("auth/register", {
        name,
        email,
        password,
        phoneNumber,
      });
      const { success, user: userData, message } = response.data;
      const parsedUser: User = userData;
      setUser(parsedUser);
      await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
      setSuccess(success);
      setMessage(message);
    } catch (err) {
      setLoading(false);
      setMessage((err as any)?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const updateProfile = async (
    email: string,
    name: string,
    password: string,
    phoneNumber: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.put("auth/update-profile", {
        email,
        name,
        password,
        phoneNumber,
      });
      const { success, updateduser: userData, message } = await response.data;
      const parsedUser: User = userData;
      setUser(parsedUser);
      await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
      setSuccess(success);
      setMessage(message);
    } catch (err) {
      setLoading(false);
      console.log((err as any)?.response?.data?.message);
      setMessage((err as any)?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
      setAuthToken(null);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  // const clearError = () => setError("");

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        loading,
        success,
        message,
        // error,
        updateProfile,
        // setError,
        // clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
