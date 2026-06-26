import { AuthProvider } from "./AuthContext";
  import { ExamProvider } from "./ExamContext";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ExamProvider>
          {children}
         </ExamProvider>
    </AuthProvider>
  );
};

export default AppProvider;