
import React from "react";
import { HabitType, JournalEntry } from "@/lib/api";
import { cn } from "@/lib/utils";
import HabitCard from "./HabitCard";

interface HabitSectionProps {
  title: string;
  habitType: HabitType;
  entries: JournalEntry[];
  onUpdate: () => void;
}

// Helper function to get the icon color based on habit type
const getHabitColor = (habit: HabitType): string => {
  const habitColorMap: Record<HabitType, string> = {
    bangun_pagi: "bg-amber-100 text-amber-700",
    beribadah: "bg-violet-100 text-violet-700",
    berolahraga: "bg-green-100 text-green-700",
    makan_sehat: "bg-emerald-100 text-emerald-700",
    gemar_belajar: "bg-blue-100 text-blue-700",
    bermasyarakat: "bg-orange-100 text-orange-700",
    tidur_cepat: "bg-indigo-100 text-indigo-700",
  };
  
  return habitColorMap[habit] || "";
};

const HabitSection: React.FC<HabitSectionProps> = ({ 
  title, 
  habitType, 
  entries, 
  onUpdate 
}) => {
  // Filter entries by the specified habit type
  const habitEntries = entries.filter(entry => entry.habit === habitType);
  
  if (habitEntries.length === 0) {
    return null; // Don't render section if no entries
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-lg", getHabitColor(habitType))}>
          <span className="font-medium">{title}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habitEntries.map((entry) => (
          <HabitCard 
            key={entry.id} 
            entry={entry} 
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitSection;
