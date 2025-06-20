import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Helper function to format date
const formatDate = (date = new Date()) => {
  return date.toISOString().replace(/[:.]/g, '-').slice(0, -5);
};

// Style configurations for Excel
const headerStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "4472C4" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } }
  }
};

const cellStyle = {
  alignment: { horizontal: "left", vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: "D3D3D3" } },
    bottom: { style: "thin", color: { rgb: "D3D3D3" } },
    left: { style: "thin", color: { rgb: "D3D3D3" } },
    right: { style: "thin", color: { rgb: "D3D3D3" } }
  }
};

const alternateRowStyle = {
  ...cellStyle,
  fill: { fgColor: { rgb: "F2F2F2" } }
};

// Function to auto-fit column widths
const autoFitColumns = (worksheet) => {
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const colWidths = [];
  
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // minimum width
    
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      
      if (cell && cell.v) {
        const cellValue = cell.v.toString();
        const cellWidth = cellValue.length + 2; // add padding
        maxWidth = Math.max(maxWidth, cellWidth);
      }
    }
    
    colWidths.push({ wch: Math.min(maxWidth, 50) }); // max width 50
  }
  
  worksheet['!cols'] = colWidths;
};

// Function to format header text
const formatHeaderText = (text) => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Function to apply styles to worksheet
const applyStyles = (worksheet) => {
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  
  // Format headers
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    const cell = worksheet[cellAddress];
    if (cell && cell.v) {
      cell.v = formatHeaderText(cell.v);
    }
  }
  
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      
      if (cell) {
        if (R === 0) {
          // Header row
          cell.s = headerStyle;
        } else if (R % 2 === 0) {
          // Even rows (alternating color)
          cell.s = alternateRowStyle;
        } else {
          // Odd rows
          cell.s = cellStyle;
        }
      }
    }
  }
};

// Export to Excel with multiple sheets
export const exportToExcel = (data, metadata) => {
  const { projectName, releaseName, tabs } = metadata;
  const workbook = XLSX.utils.book_new();
  
  // Process each tab
  tabs.forEach((tab) => {
    const tabData = data[tab.id];
    
    if (tabData && tabData.length > 0) {
      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(tabData);
      
      // Apply styling
      applyStyles(worksheet);
      
      // Auto-fit columns
      autoFitColumns(worksheet);
      
      // Add worksheet to workbook with tab name
      XLSX.utils.book_append_sheet(workbook, worksheet, tab.label.substring(0, 31)); // Excel sheet names max 31 chars
    }
  });
  
  // Generate filename
  const filename = `${projectName}_${releaseName}_Analytics_${formatDate()}.xlsx`;
  
  // Write the file
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    cellStyles: true 
  });
  
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

// Export to CSV (single tab)
export const exportToCSV = (data, metadata, tabId) => {
  const { projectName, releaseName, tabs } = metadata;
  const tab = tabs.find(t => t.id === tabId);
  const tabData = data[tabId];
  
  if (!tabData || tabData.length === 0) {
    console.warn('No data to export for tab:', tabId);
    return;
  }
  
  // Convert to CSV
  const worksheet = XLSX.utils.json_to_sheet(tabData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  // Generate filename
  const filename = `${projectName}_${releaseName}_${tab.label}_${formatDate()}.csv`;
  
  // Create blob and save
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

// Export all tabs as separate CSV files
export const exportAllToCSV = (data, metadata) => {
  const { tabs } = metadata;
  
  tabs.forEach((tab) => {
    if (data[tab.id] && data[tab.id].length > 0) {
      exportToCSV(data, metadata, tab.id);
    }
  });
};