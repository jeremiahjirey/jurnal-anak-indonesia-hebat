
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key, UserCog } from "lucide-react";

const AdminLogin = () => {
  const [nipSn, setNipSn] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await adminLogin(nipSn, uniqueCode);
      if (success) {
        navigate("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Admin Jurnal Anak Indonesia Hebat
            </CardTitle>
            <CardDescription className="text-lg">
              Masuk untuk melihat dan mengelola jurnal siswa
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nipsn" className="text-sm font-medium flex items-center gap-2">
                  <UserCog size={18} />
                  NIPSN Admin
                </label>
                <Input
                  id="nipsn"
                  placeholder="Masukkan NIPSN Admin"
                  value={nipSn}
                  onChange={(e) => setNipSn(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="uniqueCode" className="text-sm font-medium flex items-center gap-2">
                  <Key size={18} />
                  Kode Unik
                </label>
                <div className="relative">
                  <Input
                    id="uniqueCode"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan Kode Unik"
                    value={uniqueCode}
                    onChange={(e) => setUniqueCode(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button 
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk sebagai Admin"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Untuk pengembang: NIPSN = "admin123", Kode Unik = "dev123"
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
