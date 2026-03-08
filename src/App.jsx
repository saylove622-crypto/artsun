import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './system/theme/theme';
import { AuthProvider } from './system/hooks/useAuth';
import HomePage from './ux/디자인과/pages/HomePage';
import AdminLoginPage from './ux/admin/AdminLoginPage';
import AdminDashboard from './ux/admin/AdminDashboard';
import ProtectedRoute from './ux/admin/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
