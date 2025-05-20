
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
};

export default GemarBelajarForm;
