
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry, mockApi } from "@/lib/api";
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
  activity: z.string().min(3, {
    message: "Aktivitas minimal 3 karakter",
  }).max(500, {
    message: "Aktivitas maksimal 500 karakter",
  }),
  category: z.enum(["pagi", "siang", "malam"], {
    required_error: "Kategori harus dipilih",
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
          time: entry.time,
          activity: entry.activity,
          category: entry.category,
        }
      : {
          date: new Date(),
          time: format(new Date(), "HH:mm"),
          activity: "",
          category: "pagi",
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studentId) return;
    
    try {
      setIsSubmitting(true);
      
      const entryData: JournalEntry = {
        studentId,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        activity: values.activity,
        category: values.category,
      };
      
      if (isEditing && entry?.id) {
        await mockApi.updateEntry(entry.id, entryData);
        toast({
          title: "Berhasil",
          description: "Aktivitas berhasil diperbarui",
        });
      } else {
        await mockApi.createEntry(entryData);
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
        
        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pagi" className="text-journal-morning">Pagi</SelectItem>
                  <SelectItem value="siang" className="text-journal-afternoon">Siang</SelectItem>
                  <SelectItem value="malam" className="text-journal-evening">Malam</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Activity Field */}
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aktivitas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ceritakan aktivitasmu..." 
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
