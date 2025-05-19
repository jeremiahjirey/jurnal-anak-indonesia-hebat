
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define types for our context
type AuthContextType = {
  studentId: string | null;
  isAuthenticated: boolean;
  login: (nisn: string, nis: string) => Promise<boolean>;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  studentId: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check local storage for saved student ID on initial load
  useEffect(() => {
    const savedStudentId = localStorage.getItem("studentId");
    if (savedStudentId) {
      setStudentId(savedStudentId);
      setIsAuthenticated(true);
    }
  }, []);

  // Updated login function that requires NISN and NIS
  const login = async (nisn: string, nis: string): Promise<boolean> => {
    if (!nisn.trim() || !nis.trim()) {
      toast({
        title: "Error",
        description: "NISN dan NIS tidak boleh kosong",
        variant: "destructive",
      });
      return false;
    }
    
    // In a real app, validate credentials with backend
    // For now, we'll just check that both fields have values
    
    // Store student ID (NISN) in local storage
    localStorage.setItem("studentId", nisn);
    setStudentId(nisn);
    setIsAuthenticated(true);
    
    toast({
      title: "Login Berhasil",
      description: `Selamat datang, Siswa NISN: ${nisn}!`,
    });
    
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("studentId");
    setStudentId(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  // Provide auth values to children components
  return (
    <AuthContext.Provider value={{ studentId, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
