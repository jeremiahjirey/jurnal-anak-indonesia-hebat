
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface BermasyarakatFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const BermasyarakatForm: React.FC<BermasyarakatFormProps> = ({ register, errors }) => {
  return (
    <div>
      <Label htmlFor="activityDetail">Kegiatan Sosial</Label>
      <Textarea
        id="activityDetail"
        placeholder="Jelaskan kegiatan bermasyarakat yang dilakukan dan bagaimana perasaanmu setelahnya"
        className="min-h-[100px]"
        {...register("activityDetail", { required: "Kegiatan harus diisi" })}
      />
      {errors.activityDetail && <p className="text-sm text-red-500">{errors.activityDetail.message}</p>}
    </div>
  );
};

export default BermasyarakatForm;
