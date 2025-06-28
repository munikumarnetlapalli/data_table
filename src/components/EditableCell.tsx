import React, { useState, useEffect } from 'react';
import { TextField, TableCell } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { updateCell, setEditingCell } from '../store/slices/tableSlice';

interface EditableCellProps {
  rowId: string;
  columnId: string;
  value: string | number;
  editable: boolean;
}

export const EditableCell: React.FC<EditableCellProps> = ({ rowId, columnId, value, editable }) => {
  const dispatch = useAppDispatch();
  const editingCell = useAppSelector(state => state.table.editingCell);
  const [editValue, setEditValue] = useState(value.toString());
  
  const isEditing = editingCell?.rowId === rowId && editingCell?.columnId === columnId;

  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const handleDoubleClick = () => {
    if (editable) {
      dispatch(setEditingCell({ rowId, columnId }));
    }
  };

  const handleSave = () => {
    const finalValue = columnId === 'age' ? parseInt(editValue) || 0 : editValue;
    dispatch(updateCell({ rowId, columnId, value: finalValue }));
    dispatch(setEditingCell(null));
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    dispatch(setEditingCell(null));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <TableCell 
      onDoubleClick={handleDoubleClick}
      sx={{ 
        cursor: editable ? 'pointer' : 'default',
        position: 'relative',
        '&:hover': editable ? { backgroundColor: 'action.hover' } : {},
      }}
    >
      {isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          variant="standard"
          size="small"
          type={columnId === 'age' ? 'number' : 'text'}
          sx={{ minWidth: '100px' }}
        />
      ) : (
        <span>{value}</span>
      )}
    </TableCell>
  );
};