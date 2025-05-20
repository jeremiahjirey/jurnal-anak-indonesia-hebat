
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface BermasyarakatFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const BermasyarakatForm: React.FC<BermasyarakatFormProps> = ({ register, errors }) => {
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
};

export default BermasyarakatForm;
