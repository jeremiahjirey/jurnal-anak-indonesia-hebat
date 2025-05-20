
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeIcon from "@/components/TimeIcon";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface BangunPagiFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const BangunPagiForm: React.FC<BangunPagiFormProps> = ({ register, errors }) => {
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
};

export default BangunPagiForm;
