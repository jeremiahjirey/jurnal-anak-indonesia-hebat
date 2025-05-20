
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry, mockApi, HabitType } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Define form schema
const formSchema = z.object({
  date: z.date({
    required_error: "Tanggal harus diisi",
  }),
  time: z.string().min(1, {
    message: "Waktu harus diisi",
  }),
  notes: z.string().max(500, {
    message: "Catatan maksimal 500 karakter",
  }).optional(),
  habit: z.enum(["bangun_pagi", "beribadah", "berolahraga", "makan_sehat", "gemar_belajar", "bermasyarakat", "tidur_cepat"], {
    required_error: "Jenis kebiasaan harus dipilih",
  }),
});

type EntryFormProps = {
  entry?: JournalEntry;
  onSuccess: () => void;
  onCancel?: () => void;
};

const EntryForm: React.FC<EntryFormProps> = ({ entry, onSuccess, onCancel }) => {
  const { studentId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!entry;

  // Initialize form with default values or existing entry
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: entry 
      ? {
          date: new Date(entry.date),
          time: entry.time || "",
          notes: entry.notes || "",
          habit: entry.habit,
        }
      : {
          date: new Date(),
          time: format(new Date(), "HH:mm"),
          notes: "",
          habit: "bangun_pagi" as HabitType,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studentId) return;
    
    try {
      setIsSubmitting(true);
      
      const entryData: Partial<JournalEntry> = {
        studentId,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        notes: values.notes,
        habit: values.habit,
        validatedByTeacher: false,
        validatedByParent: false
      };
      
      if (isEditing && entry?.id) {
        await mockApi.updateEntry(entry.id, entryData);
        toast({
          title: "Berhasil",
          description: "Aktivitas berhasil diperbarui",
        });
      } else {
        await mockApi.createEntry(entryData as JournalEntry);
        toast({
          title: "Berhasil",
          description: "Aktivitas baru berhasil dicatat",
        });
      }
      
      onSuccess();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd MMMM yyyy")
                      ) : (
                        <span>Pilih Tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Habit Field */}
        <FormField
          control={form.control}
          name="habit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kebiasaan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Kebiasaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bangun_pagi">Bangun Pagi</SelectItem>
                  <SelectItem value="beribadah">Beribadah</SelectItem>
                  <SelectItem value="berolahraga">Berolahraga</SelectItem>
                  <SelectItem value="makan_sehat">Makan Sehat</SelectItem>
                  <SelectItem value="gemar_belajar">Gemar Belajar</SelectItem>
                  <SelectItem value="bermasyarakat">Bermasyarakat</SelectItem>
                  <SelectItem value="tidur_cepat">Tidur Cepat</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Time Field */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ceritakan detail kebiasaanmu..." 
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? "Menyimpan..." 
              : isEditing 
                ? "Perbarui" 
                : "Simpan"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EntryForm;
