import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../services/authService";

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exam, setExam] = useState(null);

  
  useEffect(() => {

    //checkUserSession();
  }, []);

  const SaveTest = (test) => {
    setExam(test);
  };

  return (
    <ExamContext.Provider value={{ exam,SaveTest }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);