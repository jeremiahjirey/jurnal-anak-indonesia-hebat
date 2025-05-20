
import React, { useState } from "react";
import { Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JournalEntry, mockApi as api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JournalEntryForm from "./JournalEntryForm";

interface HabitCardProps {
  entry: JournalEntry;
  onUpdate: () => void;
}

// Helper function to get habit display name
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

const HabitCard: React.FC<HabitCardProps> = ({ entry, onUpdate }) => {
  const { role, studentId } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isAdmin = role === "admin";
  
  const handleDelete = async () => {
    try {
      if (entry.id) {
        await api.deleteEntry(entry.id);
        toast({
          title: "Berhasil",
          description: "Aktivitas berhasil dihapus",
        });
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus aktivitas",
        variant: "destructive",
      });
    }
  };

  // Render different content based on habit type
  const renderHabitContent = () => {
    switch (entry.habit) {
      case "bangun_pagi":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Jam Bangun: <span className="font-medium text-foreground">{entry.time}</span></p>
          </div>
        );
        
      case "beribadah":
        return (
          <div className="space-y-1">
            {entry.religion === "Islam" && entry.prayerType ? (
              <p className="text-muted-foreground">Sholat: <span className="font-medium text-foreground capitalize">{entry.prayerType}</span></p>
            ) : entry.worshipActivity ? (
              <p className="text-muted-foreground">Kegiatan: <span className="font-medium text-foreground">{entry.worshipActivity}</span></p>
            ) : null}
            <p className="text-muted-foreground">Waktu: <span className="font-medium text-foreground">{entry.time}</span></p>
          </div>
        );
        
      case "berolahraga":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Mulai: <span className="font-medium text-foreground">{entry.startTime}</span></p>
            <p className="text-muted-foreground">Selesai: <span className="font-medium text-foreground">{entry.endTime}</span></p>
          </div>
        );
        
      case "makan_sehat":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Menu:</p>
            <p className="font-medium text-foreground">{entry.menuMakanan}</p>
          </div>
        );
        
      case "gemar_belajar":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Buku/Materi: <span className="font-medium text-foreground">{entry.bukuDipelajari}</span></p>
            <p className="text-muted-foreground">Informasi:</p>
            <p className="font-medium text-foreground">{entry.informasiDidapat}</p>
          </div>
        );
        
      case "bermasyarakat":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Kegiatan: <span className="font-medium text-foreground">{entry.kegiatan}</span></p>
            <p className="text-muted-foreground">Perasaan:</p>
            <p className="font-medium text-foreground">{entry.perasaanku}</p>
          </div>
        );
        
      case "tidur_cepat":
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">Jam Tidur: <span className="font-medium text-foreground">{entry.time}</span></p>
          </div>
        );
        
      default:
        return null;
    }
  };

  const handleValidation = async (type: 'teacher' | 'parent') => {
    try {
      if (entry.id) {
        const update = type === 'teacher' 
          ? { validatedByTeacher: !entry.validatedByTeacher }
          : { validatedByParent: !entry.validatedByParent };
          
        await api.updateEntry(entry.id, update);
        toast({
          title: "Berhasil",
          description: `Status validasi ${type === 'teacher' ? 'guru' : 'orang tua'} diperbarui`,
        });
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating validation:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status validasi",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{getHabitDisplayName(entry.habit)}</CardTitle>
            <Badge>{entry.religion}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {renderHabitContent()}
          
          {entry.notes && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-muted-foreground text-sm">Catatan:</p>
              <p className="text-sm">{entry.notes}</p>
            </div>
          )}
          
          <div className="mt-3 flex gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">Validasi Guru:</span>
              {entry.validatedByTeacher ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">Validasi Orang Tua:</span>
              {entry.validatedByParent ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2">
              {isAdmin && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleValidation('teacher')}
                  >
                    {entry.validatedByTeacher ? "Batalkan Validasi Guru" : "Validasi Guru"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleValidation('parent')}
                  >
                    {entry.validatedByParent ? "Batalkan Validasi Orang Tua" : "Validasi Orang Tua"}
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Aktivitas</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kebiasaan</DialogTitle>
          </DialogHeader>
          <JournalEntryForm
            defaultEntry={entry}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitCard;
