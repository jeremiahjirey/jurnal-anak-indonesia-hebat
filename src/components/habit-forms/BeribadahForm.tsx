
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeIcon from "@/components/TimeIcon";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { JournalEntry, PrayerType, ReligionType } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BeribadahFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
  religion: ReligionType | "";
  setValue: UseFormSetValue<JournalEntry>;
  defaultPrayerType?: PrayerType;
}

const BeribadahForm: React.FC<BeribadahFormProps> = ({ 
  register, 
  errors, 
  religion, 
  setValue,
  defaultPrayerType 
}) => {
  return (
    <div className="space-y-4">
      {religion === "Islam" ? (
        <>
          <div>
            <Label htmlFor="prayerType">Jenis Sholat</Label>
            <Select 
              onValueChange={(value) => setValue("prayerType", value as PrayerType)} 
              defaultValue={defaultPrayerType}
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
};

export default BeribadahForm;
