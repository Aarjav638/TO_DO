import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<string>;
  signup: (name: string, email: string, password: string, phoneNumber: string) =>  Promise<string>;
  token: string ;
    updateProfile: (
        email: string,
        name: string,
        password: string,
        phoneNumber: string
    ) =>Promise<string>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
