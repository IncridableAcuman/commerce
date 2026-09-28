import React, { createContext, useContext, useState } from "react";
import type { IUser } from "../interfaces/user.interface";

type AuthContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
};
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error();
  }
  return context;
};
