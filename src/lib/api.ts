
// API utilities for interacting with Express backend that connects to Google Sheets

import { toast } from "@/components/ui/use-toast";

// Base API URL - in production, use environment variable
const API_BASE_URL = "http://localhost:3001/api";

// Types for our journal entries
export type HabitType = 
  | "bangun_pagi"
  | "beribadah" 
  | "berolahraga" 
  | "makan_sehat" 
  | "gemar_belajar" 
  | "bermasyarakat" 
  | "tidur_cepat";

export type ReligionType = 
  | "Islam" 
  | "Kristen" 
  | "Katolik" 
  | "Hindu" 
  | "Buddha" 
  | "Konghucu" 
  | "lain-lain";

export type PrayerType = "subuh" | "dzuhur" | "ashar" | "magrib" | "isya";

export interface JournalEntry {
  id?: string;
  studentId: string;
  date: string;
  habit: HabitType;
  religion?: ReligionType;
  // Fields specific to habit types
  time?: string; // For bangun_pagi, tidur_cepat
  startTime?: string; // For berolahraga
  endTime?: string; // For berolahraga
  prayerType?: PrayerType; // For beribadah (Islam)
  worshipActivity?: string; // For beribadah (non-Islam)
  menuMakanan?: string; // For makan_sehat
  bukuDipelajari?: string; // For gemar_belajar
  informasiDidapat?: string; // For gemar_belajar
  kegiatan?: string; // For bermasyarakat
  perasaanku?: string; // For bermasyarakat
  notes?: string;
  validatedByTeacher: boolean;
  validatedByParent: boolean;
}

// Error handler
const handleError = (error: any) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: error.message || "Terjadi kesalahan saat menghubungi server",
    variant: "destructive",
  });
  throw error;
};

// API methods
export const api = {
  // Get entries for a student, optionally filtered by date and habit
  async getEntries(studentId: string, date?: string, habit?: HabitType): Promise<JournalEntry[]> {
    try {
      let url = `${API_BASE_URL}/jurnal?studentId=${studentId}`;
      if (date) url += `&date=${date}`;
      if (habit) url += `&habit=${habit}`;
      
      const response = await fetch(url, {
        headers: { 
          "Content-Type": "application/json",
          "X-Student-ID": studentId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Create a new journal entry
  async createEntry(entry: JournalEntry): Promise<JournalEntry> {
    try {
      const response = await fetch(`${API_BASE_URL}/jurnal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Student-ID": entry.studentId
        },
        body: JSON.stringify(entry)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Update an existing entry
  async updateEntry(entryId: string, entry: Partial<JournalEntry>): Promise<JournalEntry> {
    try {
      const response = await fetch(`${API_BASE_URL}/jurnal/${entryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Student-ID": entry.studentId as string
        },
        body: JSON.stringify(entry)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Delete an entry
  async deleteEntry(entryId: string, studentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/jurnal/${entryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Student-ID": studentId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return handleError(error);
    }
  }
};

// Mock API for frontend development without backend
// This will simulate API calls while we develop the frontend
export const mockApi = {
  // Mock entries for testing
  _entries: [
    { 
      id: "1", 
      studentId: "S12345", 
      date: "2025-05-19", 
      habit: "bangun_pagi" as HabitType, 
      time: "05:30", 
      religion: "Islam" as ReligionType,
      notes: "Bangun tepat waktu",
      validatedByTeacher: false,
      validatedByParent: true
    },
    { 
      id: "2", 
      studentId: "S12345", 
      date: "2025-05-19", 
      habit: "beribadah" as HabitType, 
      religion: "Islam" as ReligionType,
      prayerType: "subuh" as PrayerType,
      time: "05:45", 
      notes: "Sholat subuh",
      validatedByTeacher: false,
      validatedByParent: false
    },
    { 
      id: "3", 
      studentId: "S12345", 
      date: "2025-05-19", 
      habit: "berolahraga" as HabitType, 
      startTime: "07:00",
      endTime: "07:30",
      notes: "Jogging pagi",
      religion: "Islam" as ReligionType,
      validatedByTeacher: false,
      validatedByParent: false
    },
    { 
      id: "4", 
      studentId: "S12345", 
      date: "2025-05-18", 
      habit: "makan_sehat" as HabitType, 
      menuMakanan: "Sayur bayam, telur, dan nasi merah",
      religion: "Islam" as ReligionType,
      validatedByTeacher: true,
      validatedByParent: true
    },
  ],
  
  async getEntries(studentId: string, date?: string, habit?: HabitType): Promise<JournalEntry[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEntries = this._entries.filter(entry => entry.studentId === studentId);
    
    if (date) {
      filteredEntries = filteredEntries.filter(entry => entry.date === date);
    }
    
    if (habit) {
      filteredEntries = filteredEntries.filter(entry => entry.habit === habit);
    }
    
    return filteredEntries;
  },
  
  async createEntry(entry: JournalEntry): Promise<JournalEntry> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEntry = {
      ...entry,
      id: String(Date.now())
    };
    
    this._entries.push(newEntry);
    return newEntry;
  },
  
  async updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this._entries.findIndex(e => e.id === entryId);
    if (index === -1) {
      throw new Error("Entry not found");
    }
    
    const updatedEntry = {
      ...this._entries[index],
      ...updates
    };
    
    this._entries[index] = updatedEntry;
    return updatedEntry;
  },
  
  async deleteEntry(entryId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this._entries.findIndex(e => e.id === entryId);
    if (index !== -1) {
      this._entries.splice(index, 1);
    }
  }
};
