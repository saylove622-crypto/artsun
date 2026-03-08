import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminFooterIcon() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 2,
                pb: 4,
            }}
        >
            <Tooltip title="관리자" placement="top" arrow>
                <IconButton
                    onClick={() => navigate('/admin/login')}
                    sx={{
                        color: 'rgba(240,236,228,0.08)',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                            color: 'rgba(240,236,228,0.25)',
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(150,0,0,0.05)',
                        },
                    }}
                    aria-label="관리자 페이지"
                    size="small"
                >
                    <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
