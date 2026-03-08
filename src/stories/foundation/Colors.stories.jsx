import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default {
    title: 'Foundation/Colors',
    parameters: {
        layout: 'padded',
    },
};

function Swatch({ color, label, token }) {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    bgcolor: color,
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.1)',
                    mb: 1,
                }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                {token}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', opacity: 0.6 }}>
                {color}
            </Typography>
        </Box>
    );
}

export const Palette = () => {
    const theme = useTheme();
    const groups = [
        {
            title: 'Primary',
            swatches: [
                { color: theme.palette.primary.dark, label: 'Dark', token: 'primary.dark' },
                { color: theme.palette.primary.main, label: 'Main', token: 'primary.main' },
                { color: theme.palette.primary.light, label: 'Light', token: 'primary.light' },
            ],
        },
        {
            title: 'Secondary',
            swatches: [
                { color: theme.palette.secondary.dark, label: 'Dark', token: 'secondary.dark' },
                { color: theme.palette.secondary.main, label: 'Main', token: 'secondary.main' },
                { color: theme.palette.secondary.light, label: 'Light', token: 'secondary.light' },
            ],
        },
        {
            title: 'Info (Accent)',
            swatches: [
                { color: theme.palette.info.dark, label: 'Dark', token: 'info.dark' },
                { color: theme.palette.info.main, label: 'Main', token: 'info.main' },
                { color: theme.palette.info.light, label: 'Light', token: 'info.light' },
            ],
        },
        {
            title: 'Background',
            swatches: [
                { color: theme.palette.background.default, label: 'Default', token: 'background.default' },
                { color: theme.palette.background.paper, label: 'Paper', token: 'background.paper' },
            ],
        },
        {
            title: 'Text',
            swatches: [
                { color: theme.palette.text.primary, label: 'Primary', token: 'text.primary' },
                { color: theme.palette.text.secondary, label: 'Secondary', token: 'text.secondary' },
            ],
        },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 4 }}>
                Color Palette
            </Typography>
            {groups.map((group) => (
                <Box key={group.title} sx={{ mb: 5 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, fontWeight: 600 }}>
                        {group.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {group.swatches.map((s) => (
                            <Swatch key={s.token} {...s} />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};
