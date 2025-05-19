
import React from "react";
import { JournalEntry } from "@/lib/api";
import ActivityCard from "./ActivityCard";

interface CategorySectionProps {
  title: string;
  category: "pagi" | "siang" | "malam";
  entries: JournalEntry[];
  onUpdate: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  category,
  entries,
  onUpdate,
}) => {
  const categoryClasses = {
    pagi: "category-morning",
    siang: "category-afternoon",
    malam: "category-evening",
  };

  // Sort entries by time
  const sortedEntries = [...entries].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="mb-8">
      <h2 className={`category-title ${categoryClasses[category]} mb-4`}>
        {title}
      </h2>
      
      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <ActivityCard 
              key={entry.id} 
              entry={entry}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm italic">
          Belum ada aktivitas untuk kategori ini
        </p>
      )}
    </div>
  );
};

export default CategorySection;
