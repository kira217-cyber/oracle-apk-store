import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Page refresh এ localStorage থেকে user load করা
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("admin");
      if (storedUser) {
        setUser({
          ...JSON.parse(storedUser),
          isLoggedIn: true, // ✅ refresh এও logged in থাকবে
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth Load Error:", error);
      localStorage.removeItem("admin");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Login function
  const login = (userData) => {
    localStorage.setItem("admin", JSON.stringify(userData));
    setUser({
      ...userData,
      isLoggedIn: true,
    });
  };

  // 🔹 Logout function
  const logout = () => {
    localStorage.removeItem("admin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
