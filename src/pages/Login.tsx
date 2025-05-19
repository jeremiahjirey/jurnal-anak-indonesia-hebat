
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key, User } from "lucide-react";

const Login = () => {
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(nisn, nis);
      if (success) {
        navigate("/dashboard");
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
              Jurnal Anak Indonesia Hebat
            </CardTitle>
            <CardDescription className="text-lg">
              Masuk untuk mencatat aktivitas harianmu
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nisn" className="text-sm font-medium flex items-center gap-2">
                  <User size={18} />
                  NISN
                </label>
                <Input
                  id="nisn"
                  placeholder="Masukkan NISN"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nis" className="text-sm font-medium flex items-center gap-2">
                  <Key size={18} />
                  NIS (Password)
                </label>
                <div className="relative">
                  <Input
                    id="nis"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan NIS"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
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
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Gunakan NISN dan NIS yang diberikan oleh sekolah.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
