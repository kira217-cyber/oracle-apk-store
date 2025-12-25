import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const test = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };

    setUser(test);
  }, []); 

  const authInfo = {
    user,
    setUser, 
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
