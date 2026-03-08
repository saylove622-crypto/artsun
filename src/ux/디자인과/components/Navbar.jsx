import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    useMediaQuery,
    useTheme,
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const NAV_ITEMS = [
    { label: '홈', id: 'hero' },
    { label: '단체소개', id: 'about' },
    { label: '활동내역', id: 'history' },
    { label: '공연활동', id: 'performances' },
    { label: '영상갤러리', id: 'gallery' },
    { label: '오시는길', id: 'location' },
    { label: '연락처', id: 'contact' },
];

export default function Navbar() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track active section via Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );

        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setDrawerOpen(false);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: scrolled
                        ? `${theme.palette.background.default}ec`
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    borderBottom: scrolled
                        ? `1px solid ${theme.palette.divider}`
                        : '1px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1300,
                }}
            >
                <Toolbar
                    sx={{
                        maxWidth: '1200px',
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, md: 3 },
                        minHeight: { xs: '64px', md: '72px' },
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={() => scrollToSection('hero')}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexShrink: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: '"Noto Serif KR", serif',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                letterSpacing: '0.08em',
                                lineHeight: 1,
                            }}
                        >
                            아르-선
                        </Typography>
                        <Box
                            sx={{
                                width: '1px',
                                height: '16px',
                                bgcolor: 'rgba(150, 0, 0, 0.6)',
                                mx: 0.5,
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: '"Noto Sans KR", sans-serif',
                                fontSize: '0.65rem',
                                fontWeight: 300,
                                color: theme.palette.text.secondary,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Art Company
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop Nav */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {NAV_ITEMS.map(({ label, id }) => (
                                <Button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    sx={{
                                        color:
                                            activeSection === id
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                        fontSize: '0.82rem',
                                        fontWeight: activeSection === id ? 600 : 400,
                                        padding: '6px 14px',
                                        minWidth: 'auto',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 4,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: activeSection === id ? '20px' : '0px',
                                            height: '1.5px',
                                            bgcolor: '#960000',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            bgcolor: 'transparent',
                                            '&::after': {
                                                width: '20px',
                                            },
                                        },
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* Admin Link */}
                    {!isMobile && (
                        <Tooltip title="관리자 페이지" placement="bottom">
                            <IconButton
                                onClick={() => navigate('/admin')}
                                size="small"
                                sx={{
                                    ml: 1,
                                    color: theme.palette.text.secondary,
                                    opacity: 0.35,
                                    '&:hover': {
                                        opacity: 1,
                                        color: '#960000',
                                        bgcolor: 'rgba(150,0,0,0.06)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <LockOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Mobile Hamburger */}
                    {isMobile && (
                        <IconButton
                            onClick={() => setDrawerOpen(true)}
                            sx={{ color: theme.palette.text.primary }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: '280px',
                        bgcolor: theme.palette.background.default,
                        backdropFilter: 'blur(20px)',
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                        onClick={() => setDrawerOpen(false)}
                        sx={{ color: theme.palette.text.primary }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List sx={{ px: 2 }}>
                    {NAV_ITEMS.map(({ label, id }) => (
                        <ListItem key={id} disablePadding>
                            <ListItemButton
                                onClick={() => scrollToSection(id)}
                                sx={{
                                    py: 1.5,
                                    borderBottom: '1px solid rgba(240, 236, 228, 0.04)',
                                    '&:hover': {
                                        bgcolor: 'rgba(150, 0, 0, 0.08)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={label}
                                    primaryTypographyProps={{
                                        fontFamily: '"Noto Serif KR", serif',
                                        fontSize: '0.95rem',
                                        fontWeight: activeSection === id ? 600 : 400,
                                        color:
                                            activeSection === id
                                                ? '#960000'
                                                : 'rgba(240, 236, 228, 0.75)',
                                        letterSpacing: '0.05em',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Admin Link in Mobile Drawer */}
                <Box sx={{ px: 2, pb: 1 }}>
                    <ListItemButton
                        onClick={() => { navigate('/admin'); setDrawerOpen(false); }}
                        sx={{
                            py: 1.5,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'rgba(150,0,0,0.08)' },
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 16, mr: 1.5, color: 'rgba(240,236,228,0.3)' }} />
                        <ListItemText
                            primary="관리자 페이지"
                            primaryTypographyProps={{
                                fontFamily: '"Noto Sans KR", sans-serif',
                                fontSize: '0.8rem',
                                color: 'rgba(240,236,228,0.3)',
                                letterSpacing: '0.05em',
                            }}
                        />
                    </ListItemButton>
                </Box>

                {/* Drawer footer */}
                <Box sx={{ mt: 'auto', p: 3 }}>
                    <Typography
                        sx={{
                            fontFamily: '"Noto Serif KR", serif',
                            fontSize: '0.75rem',
                            color: 'rgba(240, 236, 228, 0.25)',
                            letterSpacing: '0.1em',
                            textAlign: 'center',
                        }}
                    >
                        아트컴퍼니 아르-선
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
}
