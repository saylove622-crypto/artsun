import { Navigate } from 'react-router-dom';
import { useAuth } from '../../system/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a0a0f' }}>
                <CircularProgress size={32} sx={{ color: '#960000' }} />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
