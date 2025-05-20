
import React, { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { 
  CalendarIcon, 
  LogOut, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Filter 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi as api, JournalEntry, HabitType } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import HabitCard from "@/components/HabitCard";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentIdFilter, setStudentIdFilter] = useState<string>("");
  const [habitFilter, setHabitFilter] = useState<HabitType | "">("");
  const [validationFilter, setValidationFilter] = useState<"all" | "validated" | "unvalidated">("all");
  
  const fetchAllEntries = async () => {
    // In a real implementation, we would get all entries from all students
    // within the date range. For now, we'll mock this by getting entries for
    // a set of student IDs.
    
    setIsLoading(true);
    
    // Mock student IDs for testing
    const studentIds = ["S12345", "S67890", "S54321"];
    let allEntries: JournalEntry[] = [];
    
    try {
      for (const id of studentIds) {
        // In a real implementation, we would have an API endpoint that accepts
        // date ranges. Here we're just using the basic getEntries to simulate.
        const data = await api.getEntries(id);
        allEntries = [...allEntries, ...data];
      }
      
      // Filter by date range
      allEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
      
      setEntries(allEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllEntries();
  }, [startDate, endDate]);
  
  // Apply additional filters
  const filteredEntries = entries.filter(entry => {
    // Filter by student ID
    if (studentIdFilter && !entry.studentId.toLowerCase().includes(studentIdFilter.toLowerCase())) {
      return false;
    }
    
    // Filter by habit type
    if (habitFilter && entry.habit !== habitFilter) {
      return false;
    }
    
    // Filter by validation status
    if (validationFilter === "validated" && (!entry.validatedByTeacher || !entry.validatedByParent)) {
      return false;
    }
    
    if (validationFilter === "unvalidated" && (entry.validatedByTeacher && entry.validatedByParent)) {
      return false;
    }
    
    return true;
  });
  
  const handleExportCSV = () => {
    exportToCSV(filteredEntries, `jurnal_${format(new Date(), 'yyyy-MM-dd')}`);
  };
  
  const handleExportPDF = () => {
    exportToPDF(filteredEntries, `jurnal_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const getHabitDisplayName = (habit: string): string => {
    const habitMap: Record<string, string> = {
      bangun_pagi: "Bangun Pagi",
      beribadah: "Beribadah",
      berolahraga: "Berolahraga",
      makan_sehat: "Makan Sehat",
      gemar_belajar: "Gemar Belajar",
      bermasyarakat: "Bermasyarakat",
      tidur_cepat: "Tidur Cepat"
    };
    
    return habitMap[habit] || habit;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Admin Dashboard - Jurnal Anak Indonesia Hebat
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Keluar
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Monitoring Jurnal Siswa
            </h2>
            <p className="text-muted-foreground">
              Periode: {format(startDate, "dd MMM yyyy")} - {format(endDate, "dd MMM yyyy")}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Rentang Tanggal
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Tanggal Mulai</label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Tanggal Akhir</label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={handleExportCSV}>
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="flex items-center mb-4 font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Filter Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">ID Siswa</label>
              <Input 
                placeholder="Cari ID siswa..." 
                value={studentIdFilter}
                onChange={(e) => setStudentIdFilter(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Jenis Kebiasaan</label>
              <Select value={habitFilter} onValueChange={(value) => setHabitFilter(value as HabitType | "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kebiasaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua kebiasaan</SelectItem>
                  <SelectItem value="bangun_pagi">Bangun Pagi</SelectItem>
                  <SelectItem value="beribadah">Beribadah</SelectItem>
                  <SelectItem value="berolahraga">Berolahraga</SelectItem>
                  <SelectItem value="makan_sehat">Makan Sehat</SelectItem>
                  <SelectItem value="gemar_belajar">Gemar Belajar</SelectItem>
                  <SelectItem value="bermasyarakat">Bermasyarakat</SelectItem>
                  <SelectItem value="tidur_cepat">Tidur Cepat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status Validasi</label>
              <Select 
                value={validationFilter} 
                onValueChange={(value) => setValidationFilter(value as "all" | "validated" | "unvalidated")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="validated">Tervalidasi</SelectItem>
                  <SelectItem value="unvalidated">Belum tervalidasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Entries list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Memuat data jurnal...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Tidak ada data</h3>
            <p className="text-muted-foreground">
              Tidak ada data jurnal yang sesuai dengan filter yang dipilih
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {filteredEntries.length} Entri Ditemukan
            </h3>
            
            <div className="space-y-6">
              {/* Group entries by studentId and date */}
              {Object.entries(
                filteredEntries.reduce<Record<string, Record<string, JournalEntry[]>>>((acc, entry) => {
                  // Create group key based on studentId and date
                  const studentKey = entry.studentId;
                  const dateKey = entry.date;
                  
                  // Initialize nested objects if they don't exist
                  if (!acc[studentKey]) acc[studentKey] = {};
                  if (!acc[studentKey][dateKey]) acc[studentKey][dateKey] = [];
                  
                  // Add entry to the appropriate group
                  acc[studentKey][dateKey].push(entry);
                  return acc;
                }, {})
              ).map(([studentId, dateEntries]) => (
                <div key={studentId} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="text-lg font-semibold mb-2">
                    Siswa: {studentId}
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(dateEntries).map(([date, entries]) => (
                      <div key={date}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          <h5 className="font-medium">{format(new Date(date), "dd MMMM yyyy")}</h5>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {entries.map((entry) => (
                            <HabitCard 
                              key={entry.id} 
                              entry={entry} 
                              onUpdate={fetchAllEntries}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
