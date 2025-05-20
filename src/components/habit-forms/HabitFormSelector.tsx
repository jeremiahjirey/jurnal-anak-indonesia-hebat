
import React from "react";
import { JournalEntry, HabitType, ReligionType, PrayerType } from "@/lib/api";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import BangunPagiForm from "./BangunPagiForm";
import BeribadahForm from "./BeribadahForm";
import BerolagahragaForm from "./BerolagahragaForm";
import MakanSehatForm from "./MakanSehatForm";
import GemarBelajarForm from "./GemarBelajarForm";
import BermasyarakatForm from "./BermasyarakatForm";
import TidurCepatForm from "./TidurCepatForm";

interface HabitFormSelectorProps {
  habit: HabitType | "";
  religion: ReligionType | "";
  register: UseFormRegister<JournalEntry>;
  errors: FieldErrors<JournalEntry>;
  setValue: UseFormSetValue<JournalEntry>;
  defaultEntry?: JournalEntry;
}

const HabitFormSelector: React.FC<HabitFormSelectorProps> = ({ 
  habit, 
  religion, 
  register, 
  errors, 
  setValue,
  defaultEntry
}) => {
  if (!habit) return null;

  switch (habit) {
    case "bangun_pagi":
      return <BangunPagiForm register={register} errors={errors} />;
      
    case "beribadah":
      return (
        <BeribadahForm 
          register={register} 
          errors={errors} 
          religion={religion} 
          setValue={setValue} 
          defaultPrayerType={defaultEntry?.prayerType}
        />
      );
      
    case "berolahraga":
      return <BerolagahragaForm register={register} errors={errors} />;
      
    case "makan_sehat":
      return <MakanSehatForm register={register} errors={errors} />;
      
    case "gemar_belajar":
      return <GemarBelajarForm register={register} errors={errors} />;
      
    case "bermasyarakat":
      return <BermasyarakatForm register={register} errors={errors} />;
      
    case "tidur_cepat":
      return <TidurCepatForm register={register} errors={errors} />;
      
    default:
      return null;
  }
};

export default HabitFormSelector;
