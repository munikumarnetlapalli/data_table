import { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { store, persistor } from './store/store';
import { ThemeProvider } from './components/ThemeProvider';
import { SearchBar } from './components/SearchBar';
import { DataTable } from './components/DataTable';
import { ColumnManagementModal } from './components/ColumnManagementModal';
import { CSVImportExport } from './components/CSVImportExport';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  const [columnModalOpen, setColumnModalOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Advanced Data Table
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your data with advanced filtering, sorting, and editing capabilities
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => setColumnModalOpen(true)}
          >
            Manage Columns
          </Button>
          <CSVImportExport />
        </Box>

        <SearchBar />
        <DataTable />

        <ColumnManagementModal
          open={columnModalOpen}
          onClose={() => setColumnModalOpen(false)}
        />
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        } 
        persistor={persistor}
      >
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;