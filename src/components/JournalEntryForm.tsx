
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry, mockApi as api, HabitType } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HabitFormSelector from "./habit-forms/HabitFormSelector";

interface JournalEntryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultDate?: Date;
  defaultEntry?: JournalEntry;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSuccess,
  onCancel,
  defaultDate,
  defaultEntry
}) => {
  const { studentId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [habit, setHabit] = useState<HabitType | "">((defaultEntry?.habit as HabitType) || "");
  const [religion, setReligion] = useState<string>(defaultEntry?.religion || "");
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<JournalEntry>({
    defaultValues: defaultEntry || {
      studentId: studentId || "",
      date: defaultDate ? new Date(defaultDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      habit: "" as HabitType,
      religion: "",
      validatedByTeacher: false,
      validatedByParent: false
    }
  });

  // Set initial values if editing
  useEffect(() => {
    if (defaultEntry) {
      setHabit(defaultEntry.habit);
      setReligion(defaultEntry.religion || "");
      
      Object.entries(defaultEntry).forEach(([key, value]) => {
        setValue(key as keyof JournalEntry, value);
      });
    }
  }, [defaultEntry, setValue]);

  const onSubmit = async (data: JournalEntry) => {
    if (!studentId) {
      toast({
        title: "Error",
        description: "ID Siswa tidak ditemukan, silakan login kembali",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (defaultEntry?.id) {
        // Update existing entry
        await api.updateEntry(defaultEntry.id, data);
        toast({
          title: "Berhasil",
          description: "Jurnal berhasil diperbarui",
        });
      } else {
        // Create new entry
        await api.createEntry({
          ...data,
          studentId,
        });
        toast({
          title: "Berhasil",
          description: "Jurnal berhasil disimpan",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jurnal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="date">Tanggal</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { required: "Tanggal harus diisi" })}
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <Label htmlFor="religion">Agama</Label>
        <Select 
          onValueChange={(value) => {
            setReligion(value);
            setValue("religion", value);
          }} 
          defaultValue={religion || undefined}
        >
          <SelectTrigger id="religion">
            <SelectValue placeholder="Pilih agama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Kristen">Kristen</SelectItem>
            <SelectItem value="Katolik">Katolik</SelectItem>
            <SelectItem value="Hindu">Hindu</SelectItem>
            <SelectItem value="Buddha">Buddha</SelectItem>
            <SelectItem value="Konghucu">Konghucu</SelectItem>
            <SelectItem value="Lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
        {!religion && <p className="text-sm text-red-500">Agama harus dipilih</p>}
      </div>

      <div>
        <Label htmlFor="habit">Jenis Kebiasaan</Label>
        <Select 
          onValueChange={(value) => {
            setHabit(value as HabitType);
            setValue("habit", value as HabitType);
          }} 
          defaultValue={habit || undefined}
        >
          <SelectTrigger id="habit">
            <SelectValue placeholder="Pilih kebiasaan" />
          </SelectTrigger>
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
        {!habit && <p className="text-sm text-red-500">Kebiasaan harus dipilih</p>}
      </div>

      {/* Dynamic fields based on habit type */}
      <HabitFormSelector 
        habit={habit}
        register={register}
        errors={errors}
        setValue={setValue}
        defaultEntry={defaultEntry}
      />

      <div>
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea
          id="notes"
          placeholder="Catatan atau komentar tambahan"
          className="min-h-[80px]"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || !habit || !religion}>
          {isLoading ? "Menyimpan..." : defaultEntry ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
