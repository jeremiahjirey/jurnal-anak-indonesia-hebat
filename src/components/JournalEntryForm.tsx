
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { 
  JournalEntry, 
  mockApi as api, 
  HabitType, 
  ReligionType, 
  PrayerType 
} from "@/lib/api";
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
import TimeIcon from "@/components/TimeIcon";

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
  const [religion, setReligion] = useState<ReligionType | "">((defaultEntry?.religion as ReligionType) || "");
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<JournalEntry>({
    defaultValues: defaultEntry || {
      studentId: studentId || "",
      date: defaultDate ? new Date(defaultDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      habit: "" as HabitType,
      religion: "" as ReligionType,
      validatedByTeacher: false,
      validatedByParent: false
    }
  });

  // Set initial values if editing
  useEffect(() => {
    if (defaultEntry) {
      setHabit(defaultEntry.habit);
      setReligion(defaultEntry.religion || "" as ReligionType);
      
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

  // Dynamic form fields based on habit type
  const renderHabitFields = () => {
    switch (habit) {
      case "bangun_pagi":
        return (
          <div className="space-y-2">
            <Label htmlFor="time">Jam Bangun</Label>
            <div className="relative">
              <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                placeholder="06:00"
                className="pl-10"
                {...register("time", { required: "Jam bangun harus diisi" })}
              />
            </div>
            {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
          </div>
        );
        
      case "beribadah":
        return (
          <div className="space-y-4">
            {religion === "Islam" ? (
              <>
                <div>
                  <Label htmlFor="prayerType">Jenis Sholat</Label>
                  <Select 
                    onValueChange={(value) => setValue("prayerType", value as PrayerType)} 
                    defaultValue={defaultEntry?.prayerType}
                  >
                    <SelectTrigger id="prayerType">
                      <SelectValue placeholder="Pilih jenis sholat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subuh">Subuh</SelectItem>
                      <SelectItem value="dzuhur">Dzuhur</SelectItem>
                      <SelectItem value="ashar">Ashar</SelectItem>
                      <SelectItem value="magrib">Maghrib</SelectItem>
                      <SelectItem value="isya">Isya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="worshipActivity">Kegiatan Ibadah</Label>
                  <Input
                    id="worshipActivity"
                    placeholder="Contoh: Misa, Puasa, Dharma"
                    {...register("worshipActivity", { 
                      required: religion !== "" && religion !== "Islam" ? "Kegiatan ibadah harus diisi" : false 
                    })}
                  />
                  {errors.worshipActivity && <p className="text-sm text-red-500">{errors.worshipActivity.message}</p>}
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="time">Waktu Ibadah</Label>
              <div className="relative">
                <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  className="pl-10"
                  {...register("time", { required: "Waktu ibadah harus diisi" })}
                />
              </div>
              {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
            </div>
          </div>
        );
        
      case "berolahraga":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startTime">Waktu Mulai</Label>
              <div className="relative">
                <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  className="pl-10"
                  {...register("startTime", { required: "Waktu mulai harus diisi" })}
                />
              </div>
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="endTime">Waktu Selesai</Label>
              <div className="relative">
                <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  className="pl-10"
                  {...register("endTime", { required: "Waktu selesai harus diisi" })}
                />
              </div>
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
            </div>
          </div>
        );
        
      case "makan_sehat":
        return (
          <div>
            <Label htmlFor="menuMakanan">Menu Makanan</Label>
            <Textarea
              id="menuMakanan"
              placeholder="Deskripsi menu makanan sehat yang dimakan"
              className="min-h-[100px]"
              {...register("menuMakanan", { required: "Menu makanan harus diisi" })}
            />
            {errors.menuMakanan && <p className="text-sm text-red-500">{errors.menuMakanan.message}</p>}
          </div>
        );
        
      case "gemar_belajar":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bukuDipelajari">Buku/Materi yang Dipelajari</Label>
              <Input
                id="bukuDipelajari"
                placeholder="Judul buku atau materi yang dipelajari"
                {...register("bukuDipelajari", { required: "Buku/materi harus diisi" })}
              />
              {errors.bukuDipelajari && <p className="text-sm text-red-500">{errors.bukuDipelajari.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="informasiDidapat">Informasi yang Didapat</Label>
              <Textarea
                id="informasiDidapat"
                placeholder="Informasi atau pengetahuan yang didapat"
                className="min-h-[100px]"
                {...register("informasiDidapat", { required: "Informasi harus diisi" })}
              />
              {errors.informasiDidapat && <p className="text-sm text-red-500">{errors.informasiDidapat.message}</p>}
            </div>
          </div>
        );
        
      case "bermasyarakat":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="kegiatan">Kegiatan Sosial</Label>
              <Input
                id="kegiatan"
                placeholder="Kegiatan bermasyarakat yang dilakukan"
                {...register("kegiatan", { required: "Kegiatan harus diisi" })}
              />
              {errors.kegiatan && <p className="text-sm text-red-500">{errors.kegiatan.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="perasaanku">Perasaan setelah kegiatan</Label>
              <Textarea
                id="perasaanku"
                placeholder="Bagaimana perasaanmu setelah melakukan kegiatan"
                className="min-h-[100px]"
                {...register("perasaanku", { required: "Perasaan harus diisi" })}
              />
              {errors.perasaanku && <p className="text-sm text-red-500">{errors.perasaanku.message}</p>}
            </div>
          </div>
        );
        
      case "tidur_cepat":
        return (
          <div>
            <Label htmlFor="time">Jam Tidur</Label>
            <div className="relative">
              <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                className="pl-10"
                {...register("time", { required: "Jam tidur harus diisi" })}
              />
            </div>
            {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
          </div>
        );
        
      default:
        return null;
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
            setReligion(value as ReligionType);
            setValue("religion", value as ReligionType);
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
            <SelectItem value="lain-lain">Lainnya</SelectItem>
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
      {habit && renderHabitFields()}

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
