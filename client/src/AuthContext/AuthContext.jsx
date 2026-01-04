import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // পেজ লোড/রিফ্রেশ হলে লোকালস্টোরেজ থেকে টোকেন + ইউজার ডেটা লোড করা
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            isLoggedIn: true,
            ...parsedUser, // name, email, id ইত্যাদি
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // লগইন ফাংশন – টোকেন এবং ইউজার ডেটা দুটোই সেভ করবে
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // ইউজার ডেটা সেভ

    setUser({
      isLoggedIn: true,
      ...userData, // name, email, id ইত্যাদি
    });
  };

  // লগআউট ফাংশন
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const authInfo = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;