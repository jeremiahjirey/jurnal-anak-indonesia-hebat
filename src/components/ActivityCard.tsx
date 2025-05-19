
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { JournalEntry, mockApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import EntryForm from "./EntryForm";

interface ActivityCardProps {
  entry: JournalEntry;
  onUpdate: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ entry, onUpdate }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const categoryClasses = {
    pagi: "journal-morning",
    siang: "journal-afternoon",
    malam: "journal-evening",
  };
  
  const handleDelete = async () => {
    if (!entry.id) return;
    
    setIsDeleting(true);
    try {
      // Here was the issue - mockApi.deleteEntry was called with two arguments
      // but likely only expects one (the entry ID)
      await mockApi.deleteEntry(entry.id);
      toast({
        title: "Berhasil",
        description: "Aktivitas berhasil dihapus",
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus aktivitas",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the time for display (remove seconds if present)
  const formattedTime = entry.time.includes(':') 
    ? entry.time.split(':').slice(0, 2).join(':')
    : entry.time;

  return (
    <>
      <Card className={`journal-card ${categoryClasses[entry.category]} animate-fade-in`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="font-medium">{formattedTime}</div>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{entry.activity}</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-0 pb-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Aktivitas</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah kamu yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Aktivitas</DialogTitle>
          </DialogHeader>
          <EntryForm 
            entry={entry}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityCard;
