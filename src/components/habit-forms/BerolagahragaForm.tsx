
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
        <Label htmlFor="time">Waktu Olahraga</Label>
        <div className="relative">
          <TimeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="time"
            type="time"
            className="pl-10"
            {...register("time", { required: "Waktu olahraga harus diisi" })}
          />
        </div>
        {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="activityDetail">Detail Aktivitas</Label>
        <Textarea
          id="activityDetail"
          placeholder="Jelaskan aktivitas olahraga yang dilakukan"
          className="min-h-[80px]"
          {...register("activityDetail", { required: "Detail aktivitas harus diisi" })}
        />
        {errors.activityDetail && <p className="text-sm text-red-500">{errors.activityDetail.message}</p>}
      </div>
    </div>
  );
};

export default BerolagahragaForm;
