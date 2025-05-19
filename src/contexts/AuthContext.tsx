
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define types for our context
type UserRole = "student" | "admin";

type AuthContextType = {
  studentId: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (nisn: string, nis: string) => Promise<boolean>;
  adminLogin: (nipSn: string, uniqueCode: string) => Promise<boolean>;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  studentId: null,
  isAuthenticated: false,
  role: "student",
  login: async () => false,
  adminLogin: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>("student");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check local storage for saved student ID on initial load
  useEffect(() => {
    const savedStudentId = localStorage.getItem("studentId");
    const savedRole = localStorage.getItem("userRole");
    
    if (savedStudentId) {
      setStudentId(savedStudentId);
      setIsAuthenticated(true);
      setRole(savedRole as UserRole || "student");
    }
  }, []);

  // Login function for students
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
    localStorage.setItem("userRole", "student");
    setStudentId(nisn);
    setRole("student");
    setIsAuthenticated(true);
    
    toast({
      title: "Login Berhasil",
      description: `Selamat datang, Siswa NISN: ${nisn}!`,
    });
    
    return true;
  };

  // Login function for admin
  const adminLogin = async (nipSn: string, uniqueCode: string): Promise<boolean> => {
    if (!nipSn.trim() || !uniqueCode.trim()) {
      toast({
        title: "Error",
        description: "NIPSN dan Kode Unik tidak boleh kosong",
        variant: "destructive",
      });
      return false;
    }
    
    // In a real app, validate admin credentials with backend
    // For demo, use these hardcoded credentials: admin123 / dev123
    if (nipSn === "admin123" && uniqueCode === "dev123") {
      localStorage.setItem("studentId", nipSn); // We reuse studentId for simplicity
      localStorage.setItem("userRole", "admin");
      setStudentId(nipSn);
      setRole("admin");
      setIsAuthenticated(true);
      
      toast({
        title: "Login Admin Berhasil",
        description: "Selamat datang, Admin!",
      });
      
      return true;
    } else {
      toast({
        title: "Login Gagal",
        description: "NIPSN atau Kode Unik tidak valid",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("userRole");
    setStudentId(null);
    setRole("student");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Provide auth values to children components
  return (
    <AuthContext.Provider value={{ 
      studentId, 
      isAuthenticated, 
      role,
      login, 
      adminLogin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
