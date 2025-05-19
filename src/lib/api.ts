
// API utilities for interacting with Express backend that connects to Google Sheets

import { toast } from "@/components/ui/use-toast";

// Base API URL - in production, use environment variable
const API_BASE_URL = "http://localhost:3001/api";

// Types for our journal entries
export interface JournalEntry {
  id?: string;
  studentId: string;
  date: string;
  time: string;
  activity: string;
  category: "pagi" | "siang" | "malam";
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
  // Get entries for a student, optionally filtered by date
  async getEntries(studentId: string, date?: string): Promise<JournalEntry[]> {
    try {
      let url = `${API_BASE_URL}/jurnal?studentId=${studentId}`;
      if (date) url += `&date=${date}`;
      
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
    { id: "1", studentId: "S12345", date: "2025-05-19", time: "08:00", activity: "Belajar Matematika", category: "pagi" as const },
    { id: "2", studentId: "S12345", date: "2025-05-19", time: "13:00", activity: "Membaca Buku", category: "siang" as const },
    { id: "3", studentId: "S12345", date: "2025-05-19", time: "19:30", activity: "Mengerjakan PR", category: "malam" as const },
    { id: "4", studentId: "S12345", date: "2025-05-18", time: "07:30", activity: "Olahraga Pagi", category: "pagi" as const },
  ],
  
  async getEntries(studentId: string, date?: string): Promise<JournalEntry[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEntries = this._entries.filter(entry => entry.studentId === studentId);
    
    if (date) {
      filteredEntries = filteredEntries.filter(entry => entry.date === date);
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
