
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi as api, JournalEntry, HabitType } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import JournalEntryForm from "@/components/JournalEntryForm";
import HabitSection from "@/components/HabitSection";

const Dashboard: React.FC = () => {
  const { studentId, logout } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
  const fetchEntries = async () => {
    if (!studentId) return;
    
    setIsLoading(true);
    try {
      const data = await api.getEntries(studentId, formattedDate);
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEntries();
  }, [studentId, formattedDate]);

  // List of all habit types to display
  const habitTypes: { type: HabitType; title: string }[] = [
    { type: "bangun_pagi", title: "Bangun Pagi" },
    { type: "beribadah", title: "Beribadah" },
    { type: "berolahraga", title: "Berolahraga" },
    { type: "makan_sehat", title: "Makan Sehat" },
    { type: "gemar_belajar", title: "Gemar Belajar" },
    { type: "bermasyarakat", title: "Bermasyarakat" },
    { type: "tidur_cepat", title: "Tidur Cepat" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Jurnal Anak Indonesia Hebat
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Halo, <span className="font-medium">{studentId}</span>
            </p>
            <h2 className="text-2xl font-bold">
              Jurnal 7 Kebiasaan pada {format(date, "dd MMMM yyyy")}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Pilih Tanggal
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kebiasaan
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Memuat aktivitas...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Belum ada aktivitas</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum mencatat kebiasaan apapun pada tanggal ini
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kebiasaan Sekarang
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {habitTypes.map((habit) => (
              <HabitSection
                key={habit.type}
                title={habit.title}
                habitType={habit.type}
                entries={entries}
                onUpdate={fetchEntries}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kebiasaan Baru</DialogTitle>
          </DialogHeader>
          <JournalEntryForm 
            defaultDate={date}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              fetchEntries();
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
