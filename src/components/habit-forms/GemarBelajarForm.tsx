
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface GemarBelajarFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const GemarBelajarForm: React.FC<GemarBelajarFormProps> = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="activityDetail">Materi yang Dipelajari</Label>
        <Textarea
          id="activityDetail"
          placeholder="Jelaskan materi atau buku yang dipelajari dan informasi yang didapat"
          className="min-h-[100px]"
          {...register("activityDetail", { required: "Materi belajar harus diisi" })}
        />
        {errors.activityDetail && <p className="text-sm text-red-500">{errors.activityDetail.message}</p>}
      </div>
    </div>
  );
};

export default GemarBelajarForm;
