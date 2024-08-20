import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phoneNumber: string) => Promise<void>;
  success: boolean;
  message: string;
  loading: boolean;
    updateProfile: (
        email: string,
        name: string,
        password: string,
        phoneNumber: string
    ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
