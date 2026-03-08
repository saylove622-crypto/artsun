import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#960000',
            light: '#c43030',
            dark: '#6a0000',
            contrastText: '#fff',
        },
        secondary: {
            main: '#31466b',
            light: '#5a7199',
            dark: '#1a2940',
            contrastText: '#fff',
        },
        info: {
            main: '#533b72',
            light: '#7e6199',
            dark: '#362450',
        },
        background: {
            default: '#0a0a0f',
            paper: '#12121a',
        },
        text: {
            primary: '#f0ece4',
            secondary: '#b0a89c',
        },
        divider: 'rgba(240, 236, 228, 0.12)',
    },
    typography: {
        fontFamily: '"Noto Sans KR", "Inter", sans-serif',
        h1: {
            fontFamily: '"Shilla", "Noto Serif KR", serif',
            fontWeight: 700,
            letterSpacing: '0.02em',
        },
        h2: {
            fontFamily: '"Shilla", "Noto Serif KR", serif',
            fontWeight: 700,
            letterSpacing: '0.01em',
        },
        h3: {
            fontFamily: '"Shilla", "Noto Serif KR", serif',
            fontWeight: 700,
        },
        h4: {
            fontFamily: '"Shilla", "Noto Serif KR", serif',
            fontWeight: 500,
        },
        h5: {
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: 500,
        },
        h6: {
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: 500,
        },
        body1: {
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.8,
        },
        body2: {
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.7,
        },
        button: {
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: 500,
            letterSpacing: '0.05em',
        },
        // 커스텀 variants
        sectionLabel: {
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
        },
        cardTitle: {
            fontFamily: '"Noto Serif KR", serif',
            fontSize: '1rem',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 2,
    },
    components: {
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'sectionLabel' },
                    style: {
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                    },
                },
                {
                    props: { variant: 'cardTitle' },
                    style: {
                        fontFamily: '"Noto Serif KR", serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                    },
                },
            ],
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    textTransform: 'none',
                    padding: '10px 28px',
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(240, 236, 228, 0.12)',
                    borderRadius: 2,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        borderColor: 'rgba(150, 0, 0, 0.5)',
                        boxShadow: '0 0 20px rgba(150, 0, 0, 0.1)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            },
        },
    },
});

export default theme;
