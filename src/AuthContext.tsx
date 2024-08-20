import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, username: string, userId: string) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('isLoggedIn') === 'yes'
  );

  const login = (token: string, username: string, userId: string) => {
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserName', username);
    localStorage.setItem('isLoggedIn', 'yes');
    localStorage.setItem('currentJWT', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentJWT');
    localStorage.setItem('isLoggedIn', 'no');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
