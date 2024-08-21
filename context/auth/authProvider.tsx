import React, { useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { setAuthToken } from "../axiosConfig";
import AuthContext, { User } from "./authContext";
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (token && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error loading user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.post("auth/login", { email, password });
      const { success, token, user: userData } = response.data;

      if (success) {
        const parsedUser: User = userData;
        setUser(parsedUser);
        setAuthToken(token);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
        return "Login successful";
      } else {
        return "Login failed: Unsuccessful response";
      }
    } catch (err) {
      return (err as any)?.response?.data?.message || "Login failed";
    }
  };
  const signup = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<string> => {
    try {
      const response = await axios.post("auth/register", {
        name,
        email,
        password,
        phoneNumber,
      });

      const { success } = response.data;

      if (success) {
        return "SignUp successful";
      } else {
        return "SignUp failed: Unsuccessful response";
      }
    } catch (err) {
      return (err as any)?.response?.data?.message || "SignUp failed";
    }
  };

  const updateProfile = async (
    email: string,
    name: string,
    password: string,
    phoneNumber: string
  ): Promise<string> => {
    try {
      const response = await axios.put("auth/update-profile", {
        email,
        name,
        password,
        phoneNumber,
      });

      const { success, updateduser: userData } = response.data;

      if (success) {
        const parsedUser: User = userData;
        setUser(parsedUser);
        await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
        return "Update successful";
      } else {
        return "Update failed: Unsuccessful response";
      }
    } catch (err) {
      return (err as any)?.response?.data?.message || "Update failed";
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setUser(null);
      axios.defaults.headers.common["Authorization"] = "";
    } catch (err) {
      console.error("Error logging out", err);
    }
  };
  if (loading) {
    return null;
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        token,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
