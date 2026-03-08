import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default {
    title: 'Foundation/Spacing',
    parameters: {
        layout: 'padded',
    },
};

export const Scale = () => {
    const theme = useTheme();
    const steps = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12];

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
                Spacing Scale
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 4 }}>
                1 unit = {theme.spacing(1)}
            </Typography>
            {steps.map((s) => (
                <Box key={s} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 2 }}>
                    <Typography sx={{ width: 80, fontSize: '0.75rem', color: 'text.secondary', textAlign: 'right' }}>
                        spacing({s})
                    </Typography>
                    <Box
                        sx={{
                            height: 24,
                            width: theme.spacing(s),
                            bgcolor: 'primary.main',
                            borderRadius: 0.5,
                            minWidth: 2,
                            opacity: 0.8,
                        }}
                    />
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', opacity: 0.6 }}>
                        {theme.spacing(s)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};
