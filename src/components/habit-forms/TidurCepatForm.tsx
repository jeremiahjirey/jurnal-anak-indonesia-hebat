
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeIcon from "@/components/TimeIcon";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface TidurCepatFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const TidurCepatForm: React.FC<TidurCepatFormProps> = ({ register, errors }) => {
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
};

export default TidurCepatForm;
