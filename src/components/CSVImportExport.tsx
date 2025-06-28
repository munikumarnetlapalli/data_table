import { useRef } from 'react';
import { Button, Box } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { importData, TableRow } from '../store/slices/tableSlice';

type RawCSVRow = Record<string, string>; // 💡 Type for parsed CSV row

export const CSVImportExport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns } = useAppSelector(state => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data as RawCSVRow[];

        if (!raw || raw.length === 0) {
          alert("CSV is empty or invalid.");
          return;
        }

        const normalizedData: TableRow[] = raw.map((row, index) => {
          const normalizedRow: RawCSVRow = {};

          Object.keys(row).forEach((key) => {
            const normalizedKey = key.trim().toLowerCase();
            normalizedRow[normalizedKey] = row[key]?.toString().trim() ?? '';
          });

          return {
            id: `imported-${Date.now()}-${index}`,
            name: normalizedRow.name || '',
            email: normalizedRow.email || '',
            age: parseInt(normalizedRow.age) || 0,
            role: normalizedRow.role || '',
            department: normalizedRow.department || '',
            location: normalizedRow.location || '',
          };
        });

        console.log("✅ Imported CSV Data:", normalizedData);
        dispatch(importData(normalizedData));
      },
      error: (error) => {
        console.error('❌ Error parsing CSV:', error);
        alert("CSV parsing failed. Please check the file format.");
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const exportData = data.map(row => {
      const exportRow: Record<string, string | number> = {};
      visibleColumns.forEach(col => {
        exportRow[col.label] = row[col.id];
      });
      return exportRow;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table-data.csv');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        variant="outlined"
        startIcon={<Upload />}
        onClick={() => fileInputRef.current?.click()}
      >
        Import CSV
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleExport}
      >
        Export CSV
      </Button>
    </Box>
  );
};
