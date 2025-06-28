import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: string | number;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  editable: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchQuery: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  rowsPerPage: number;
  editingCell: { rowId: string; columnId: string } | null;
}

const initialColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true, editable: true },
  { id: 'email', label: 'Email', visible: true, sortable: true, editable: true },
  { id: 'age', label: 'Age', visible: true, sortable: true, editable: true },
  { id: 'role', label: 'Role', visible: true, sortable: true, editable: true },
];

const initialData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', age: 29, role: 'Developer' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', age: 35, role: 'Analyst' },
  { id: '6', name: 'Diana Wilson', email: 'diana@example.com', age: 27, role: 'Designer' },
  { id: '7', name: 'Edward Taylor', email: 'edward@example.com', age: 41, role: 'Manager' },
  { id: '8', name: 'Fiona Garcia', email: 'fiona@example.com', age: 33, role: 'Developer' },
  { id: '9', name: 'George Martinez', email: 'george@example.com', age: 39, role: 'Analyst' },
  { id: '10', name: 'Helen Rodriguez', email: 'helen@example.com', age: 31, role: 'Designer' },
  { id: '11', name: 'Ivan Hernandez', email: 'ivan@example.com', age: 26, role: 'Developer' },
  { id: '12', name: 'Julia Lopez', email: 'julia@example.com', age: 37, role: 'Manager' },
  { id: '13', name: 'Kevin Gonzalez', email: 'kevin@example.com', age: 30, role: 'Analyst' },
  { id: '14', name: 'Linda Perez', email: 'linda@example.com', age: 34, role: 'Designer' },
  { id: '15', name: 'Michael Lee', email: 'michael@example.com', age: 42, role: 'Developer' },
];

const initialState: TableState = {
  data: initialData,
  columns: initialColumns,
  searchQuery: '',
  sortColumn: null,
  sortDirection: 'asc',
  currentPage: 0,
  rowsPerPage: 10,
  editingCell: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setSorting: (state, action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>) => {
      state.sortColumn = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    updateColumnVisibility: (state, action: PayloadAction<{ columnId: string; visible: boolean }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        column.visible = action.payload.visible;
      }
    },
    addColumn: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const newColumn: ColumnConfig = {
        id: action.payload.id,
        label: action.payload.label,
        visible: true,
        sortable: true,
        editable: true,
      };
      state.columns.push(newColumn);
      
      // Add empty values for this column to all existing rows
      state.data.forEach(row => {
        row[action.payload.id] = '';
      });
    },
    updateCell: (state, action: PayloadAction<{ rowId: string; columnId: string; value: string | number }>) => {
      const row = state.data.find(row => row.id === action.payload.rowId);
      if (row) {
        row[action.payload.columnId] = action.payload.value;
      }
    },
    setEditingCell: (state, action: PayloadAction<{ rowId: string; columnId: string } | null>) => {
      state.editingCell = action.payload;
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    importData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<Omit<TableRow, 'id'>>) => {
      const newRow: TableRow = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.data.push(newRow);
    },
  },
});

export const {
  setSearchQuery,
  setSorting,
  setCurrentPage,
  updateColumnVisibility,
  addColumn,
  updateCell,
  setEditingCell,
  deleteRow,
  importData,
  addRow,
} = tableSlice.actions;

export default tableSlice.reducer;