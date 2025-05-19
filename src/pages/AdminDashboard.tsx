
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntry, mockApi } from "@/lib/api";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download, Search, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect non-admin users
  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      navigate("/login/admin");
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch all journal entries
  useEffect(() => {
    const fetchAllEntries = async () => {
      setLoading(true);
      try {
        // In a real app, we would have an admin-specific API endpoint
        // For now, just get all entries from the mock API
        const allEntries = await mockApi.getEntries("");
        setEntries(allEntries);
      } catch (error) {
        console.error("Error fetching entries:", error);
        toast({
          title: "Error",
          description: "Gagal mengambil data jurnal siswa",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && role === "admin") {
      fetchAllEntries();
    }
  }, [isAuthenticated, role, toast]);

  // Filter entries based on search term and date
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === "" || 
      entry.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDate = filterDate === "" || entry.date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  // Handle export to CSV
  const handleExportCSV = () => {
    const filename = filterDate ? 
      `jurnal-siswa-${filterDate}` : 
      `jurnal-siswa-${new Date().toISOString().split('T')[0]}`;
      
    exportToCSV(filteredEntries, filename);
    
    toast({
      title: "Export Berhasil",
      description: `Data telah diexport sebagai ${filename}.csv`,
    });
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const filename = filterDate ? 
      `jurnal-siswa-${filterDate}` : 
      `jurnal-siswa-${new Date().toISOString().split('T')[0]}`;
      
    exportToPDF(filteredEntries, filename);
    
    toast({
      title: "Export PDF",
      description: "Halaman PDF telah dibuka di tab baru",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Dashboard Admin
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitor dan kelola jurnal aktivitas siswa
            </p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </CardHeader>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan ID siswa atau aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative w-full md:w-1/3">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto md:ml-auto">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExportCSV}
              >
                <FileText size={18} />
                <span className="hidden md:inline">Export Excel</span>
                <span className="md:hidden">Excel</span>
              </Button>
              
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={handleExportPDF}
              >
                <Download size={18} />
                <span className="hidden md:inline">Download PDF</span>
                <span className="md:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <Table>
            <TableCaption>
              {loading ? "Memuat data..." : 
                filteredEntries.length > 0 
                  ? `Total ${filteredEntries.length} entri jurnal siswa`
                  : "Tidak ada data jurnal yang ditemukan"}
            </TableCaption>
            
            <TableHeader>
              <TableRow>
                <TableHead>ID Siswa</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="w-[300px]">Aktivitas</TableHead>
                <TableHead>Kategori</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.studentId}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.activity}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.category === "pagi" ? "bg-blue-100 text-blue-800" :
                        entry.category === "siang" ? "bg-yellow-100 text-yellow-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {entry.category}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
