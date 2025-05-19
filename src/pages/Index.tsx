
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-4xl px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
          Jurnal Anak Indonesia Hebat
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Catat aktivitas harianmu dan kembangkan kebiasaan positif. 
          Setiap aktivitasmu adalah langkah menuju kesuksesan!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="text-lg px-8"
          >
            Masuk
          </Button>
          
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            size="lg"
            className="text-lg px-8"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-2 text-journal-morning">Catat Aktivitasmu</h2>
          <p>Rekam setiap momen penting dalam harimu dan lihat perkembanganmu dari waktu ke waktu.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-2 text-journal-afternoon">Kelola Waktumu</h2>
          <p>Kategorikan aktivitasmu berdasarkan pagi, siang, dan malam hari untuk membantu pengelolaan waktu.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-2 text-journal-evening">Refleksikan Harimu</h2>
          <p>Lihat kembali aktivitasmu dan refleksikan apa yang telah kamu pelajari dan capai setiap hari.</p>
        </div>
      </div>
      
      <footer className="mt-16 py-8 text-center text-gray-500">
        <p>© 2025 Jurnal Anak Indonesia Hebat</p>
      </footer>
    </div>
  );
};

export default Index;
