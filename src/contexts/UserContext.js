import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook for using context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user data to localStorage whenever user changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (token) => {
    setUser({ token });
  };

  const logout = () => {
    setUser(null); // Clear user data from context
    localStorage.removeItem('user'); // Clear user data from localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
