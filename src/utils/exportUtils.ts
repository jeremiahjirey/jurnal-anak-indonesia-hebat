
import { JournalEntry } from "@/lib/api";

// Helper function to get habit display name
const getHabitDisplayName = (habit: string): string => {
  const habitMap: Record<string, string> = {
    bangun_pagi: "Bangun Pagi",
    beribadah: "Beribadah",
    berolahraga: "Berolahraga",
    makan_sehat: "Makan Sehat",
    gemar_belajar: "Gemar Belajar",
    bermasyarakat: "Bermasyarakat",
    tidur_cepat: "Tidur Cepat"
  };
  
  return habitMap[habit] || habit;
};

export const exportToCSV = (data: JournalEntry[], filename: string) => {
  // Convert the data to CSV format
  const headers = [
    "ID Siswa", 
    "Tanggal", 
    "Kebiasaan", 
    "Agama", 
    "Detail",
    "Catatan",
    "Validasi Guru", 
    "Validasi Orang Tua"
  ];
  
  const csvRows: string[] = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const entry of data) {
    // Generate detail text based on habit type
    let detailText = "";
    
    switch (entry.habit) {
      case "bangun_pagi":
        detailText = `Jam Bangun: ${entry.time}`;
        break;
      case "beribadah":
        if (entry.religion === "Islam" && entry.prayerType) {
          detailText = `Sholat ${entry.prayerType} (${entry.time})`;
        } else if (entry.worshipActivity) {
          detailText = `${entry.worshipActivity} (${entry.time})`;
        }
        break;
      case "berolahraga":
        detailText = `${entry.startTime} - ${entry.endTime}`;
        break;
      case "makan_sehat":
        detailText = entry.menuMakanan || "";
        break;
      case "gemar_belajar":
        detailText = `${entry.bukuDipelajari}: ${entry.informasiDidapat}`;
        break;
      case "bermasyarakat":
        detailText = `${entry.kegiatan}: ${entry.perasaanku}`;
        break;
      case "tidur_cepat":
        detailText = `Jam Tidur: ${entry.time}`;
        break;
    }
    
    const values = [
      entry.studentId,
      entry.date,
      getHabitDisplayName(entry.habit),
      entry.religion || "",
      `"${detailText.replace(/"/g, '""')}"`, // Escape quotes
      `"${(entry.notes || '').replace(/"/g, '""')}"`,
      entry.validatedByTeacher ? "Ya" : "Tidak",
      entry.validatedByParent ? "Ya" : "Tidak"
    ];
    csvRows.push(values.join(','));
  }
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create downloadable link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create link and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: JournalEntry[], filename: string) => {
  // For simplicity, we'll create a printable HTML page that the user can save as PDF
  // In a production app, you might want to use a library like jsPDF or pdfmake
  
  // Create a new window with printable content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Popup blocked. Please allow popups for this website.');
    return;
  }
  
  // Group data by student and date for better organization
  const groupedData: Record<string, Record<string, JournalEntry[]>> = {};
  
  data.forEach(entry => {
    if (!groupedData[entry.studentId]) {
      groupedData[entry.studentId] = {};
    }
    
    if (!groupedData[entry.studentId][entry.date]) {
      groupedData[entry.studentId][entry.date] = [];
    }
    
    groupedData[entry.studentId][entry.date].push(entry);
  });
  
  // Create the HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Jurnal Anak Indonesia Hebat - ${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { margin-bottom: 10px; }
        h1 { text-align: center; color: #4a5568; }
        h2 { color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
        h3 { color: #4a5568; }
        .date { color: #718096; font-style: italic; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
        th { background-color: #f7fafc; }
        .validation { display: inline-block; margin-right: 20px; }
        .validated { color: green; }
        .not-validated { color: #a0aec0; }
        .print-button { display: flex; justify-content: center; margin: 20px; }
        @media print {
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Jurnal 7 Kebiasaan Anak Indonesia Hebat</h1>
      <p class="date">Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
      
      <div class="print-button">
        <button onclick="window.print()">Print/Save as PDF</button>
      </div>
  `;
  
  // Generate content for each student
  Object.entries(groupedData).forEach(([studentId, dateLogs]) => {
    htmlContent += `
      <h2>Siswa: ${studentId}</h2>
    `;
    
    Object.entries(dateLogs).forEach(([date, entries]) => {
      const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      htmlContent += `
        <h3>Tanggal: ${formattedDate}</h3>
        <table>
          <thead>
            <tr>
              <th>Kebiasaan</th>
              <th>Agama</th>
              <th>Detail</th>
              <th>Catatan</th>
              <th>Validasi</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      entries.forEach(entry => {
        // Generate detail text based on habit type
        let detailText = "";
        
        switch (entry.habit) {
          case "bangun_pagi":
            detailText = `Jam Bangun: ${entry.time}`;
            break;
          case "beribadah":
            if (entry.religion === "Islam" && entry.prayerType) {
              detailText = `Sholat ${entry.prayerType} (${entry.time})`;
            } else if (entry.worshipActivity) {
              detailText = `${entry.worshipActivity} (${entry.time})`;
            }
            break;
          case "berolahraga":
            detailText = `${entry.startTime} - ${entry.endTime}`;
            break;
          case "makan_sehat":
            detailText = entry.menuMakanan || "";
            break;
          case "gemar_belajar":
            detailText = `${entry.bukuDipelajari}: ${entry.informasiDidapat}`;
            break;
          case "bermasyarakat":
            detailText = `${entry.kegiatan}: ${entry.perasaanku}`;
            break;
          case "tidur_cepat":
            detailText = `Jam Tidur: ${entry.time}`;
            break;
        }
        
        const validationHtml = `
          <div class="validation ${entry.validatedByTeacher ? 'validated' : 'not-validated'}">
            Guru: ${entry.validatedByTeacher ? '✓' : '✗'}
          </div>
          <div class="validation ${entry.validatedByParent ? 'validated' : 'not-validated'}">
            Orang Tua: ${entry.validatedByParent ? '✓' : '✗'}
          </div>
        `;
        
        htmlContent += `
          <tr>
            <td>${getHabitDisplayName(entry.habit)}</td>
            <td>${entry.religion || '-'}</td>
            <td>${detailText}</td>
            <td>${entry.notes || '-'}</td>
            <td>${validationHtml}</td>
          </tr>
        `;
      });
      
      htmlContent += `
          </tbody>
        </table>
      `;
    });
  });
  
  // Close the HTML content
  htmlContent += `
      <div class="print-button">
        <button onclick="window.print()">Print/Save as PDF</button>
      </div>
    </body>
    </html>
  `;
  
  // Write the HTML to the new window
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
