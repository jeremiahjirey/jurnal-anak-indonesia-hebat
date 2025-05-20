
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeIcon from "@/components/TimeIcon";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface BerolagahragaFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const BerolagahragaForm: React.FC<BerolagahragaFormProps> = ({ register, errors }) => {
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
};

export default BerolagahragaForm;
