import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { updateColumnVisibility, addColumn } from '../store/slices/tableSlice';

interface ColumnManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export const ColumnManagementModal: React.FC<ColumnManagementModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(state => state.table.columns);
  const [newColumnName, setNewColumnName] = useState('');

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    dispatch(updateColumnVisibility({ columnId, visible }));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      dispatch(addColumn({ id: columnId, label: newColumnName }));
      setNewColumnName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Column Visibility
          </Typography>
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Switch
                  checked={column.visible}
                  onChange={(e) => handleColumnVisibilityChange(column.id, e.target.checked)}
                />
              }
              label={column.label}
              sx={{ display: 'block' }}
            />
          ))}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Add New Column
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Column Name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleAddColumn}
              disabled={!newColumnName.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};