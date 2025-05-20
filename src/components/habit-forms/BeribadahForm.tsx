
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeIcon from "@/components/TimeIcon";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface BeribadahFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
  setValue: UseFormSetValue<JournalEntry>;
  defaultWorshipType?: string;
}

const BeribadahForm: React.FC<BeribadahFormProps> = ({ 
  register, 
  errors,
  setValue,
  defaultWorshipType 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="worshipType">Jenis Ibadah</Label>
        <Input
          id="worshipType"
          placeholder="Contoh: Subuh, Misa, Puja, dsb."
          defaultValue={defaultWorshipType}
          {...register("worshipType", { 
            required: "Jenis ibadah harus diisi" 
          })}
        />
        {errors.worshipType && <p className="text-sm text-red-500">{errors.worshipType.message}</p>}
      </div>
      
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
