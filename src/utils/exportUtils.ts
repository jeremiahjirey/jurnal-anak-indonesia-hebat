
import { JournalEntry } from "@/lib/api";

export const exportToCSV = (data: JournalEntry[], filename: string) => {
  // Convert the data to CSV format
  const headers = ["ID Siswa", "Tanggal", "Waktu", "Aktivitas", "Kategori"];
  const csvRows: string[] = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const entry of data) {
    const values = [
      entry.studentId,
      entry.date,
      entry.time,
      `"${entry.activity.replace(/"/g, '""')}"`, // Escape quotes
      entry.category
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
  
  // Create the HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Jurnal Siswa - ${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h2 { text-align: center; }
        .print-button { display: flex; justify-content: center; margin: 20px; }
        @media print {
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Jurnal Anak Indonesia Hebat</h1>
      <h2>${filename}</h2>
      
      <div class="print-button">
        <button onclick="window.print()">Print/Save as PDF</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID Siswa</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Aktivitas</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add table rows with data
  data.forEach(entry => {
    htmlContent += `
      <tr>
        <td>${entry.studentId}</td>
        <td>${entry.date}</td>
        <td>${entry.time}</td>
        <td>${entry.activity}</td>
        <td>${entry.category}</td>
      </tr>
    `;
  });
  
  // Close the HTML content
  htmlContent += `
        </tbody>
      </table>
      
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
