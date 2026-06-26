import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [authLoading, setAuthLoading] = useState(true);

  const checkUserSession = async () => { 
    try { 
      const data = await checkAuth(); 
      setUser(data?.info); 
    } catch (err) { 
      setUser(null); 
    } finally { 
      setAuthLoading(false); 
    } };

  useEffect(() => {
    checkUserSession();
  }, []);

  const loginUser = (userdata) => {
    setUser(userdata);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,authLoading, loginUser, logoutUser, checkUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);