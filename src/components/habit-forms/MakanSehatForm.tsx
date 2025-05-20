
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JournalEntry } from "@/lib/api";

interface MakanSehatFormProps {
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
}

const MakanSehatForm: React.FC<MakanSehatFormProps> = ({ register, errors }) => {
  return (
    <div>
      <Label htmlFor="menuMakanan">Menu Makanan</Label>
      <Textarea
        id="menuMakanan"
        placeholder="Deskripsi menu makanan sehat yang dimakan"
        className="min-h-[100px]"
        {...register("menuMakanan", { required: "Menu makanan harus diisi" })}
      />
      {errors.menuMakanan && <p className="text-sm text-red-500">{errors.menuMakanan.message}</p>}
    </div>
  );
};

export default MakanSehatForm;
