import { useState, useEffect } from 'react';
import { Box, Container, Typography, Tab, Tabs, Paper, Grid, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../system/utils/supabase';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const WELCOME_AUDIENCE = [
    '초심자 (열정이 있는 누구나)',
    '경력 단절자 (다시 예술을 시작하고 싶은 분)',
    '공연 활동이 가능한 자',
    '스트레스 해소와 활력이 필요하신 분',
    '행복한 소통을 꿈꾸는 분',
];

// Directional tracking for animation
let lastTab = 0;

export default function RecruitmentSection() {
    const [activeTab, setActiveTab] = useState(0);
    const [direction, setDirection] = useState(1);
    const [recruitmentData, setRecruitmentData] = useState({ recruitment_info: '', certification_info: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'recruitment')
                .single();
            if (data) setRecruitmentData(data.value);
        };
        fetchSettings();
    }, []);

    const handleTabChange = (_, v) => {
        setDirection(v > lastTab ? 1 : -1);
        lastTab = v;
        setActiveTab(v);
    };

    const contentVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 400 : -400,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            zIndex: 0,
            x: dir < 0 ? 400 : -400,
            opacity: 0,
        }),
    };

    const scrollToContact = () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            id="recruitment"
            sx={{
                py: { xs: 5, md: 7 },
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle watermark-like bg text */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '-3%',
                    fontSize: '12rem',
                    fontFamily: '"Noto Serif KR", serif',
                    fontWeight: 900,
                    color: 'rgba(150,0,0,0.025)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    lineHeight: 1,
                }}
            >
                아르선
            </Box>

            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                    <Typography
                        sx={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            letterSpacing: '0.3em',
                            color: '#960000',
                            textTransform: 'uppercase',
                            mb: 0.4,
                            display: 'block',
                        }}
                    >
                        RECRUITMENT &amp; EDUCATION
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, mb: 5, color: 'text.primary' }}
                    >
                        단원 모집 및 교육 과정
                    </Typography>

                    {/* Tab Switcher */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            sx={{
                                bgcolor: '#ffffff',
                                borderRadius: '50px',
                                p: 0.6,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(49,70,107,0.07)',
                            }}
                        >
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    minHeight: 'auto',
                                    '& .MuiTabs-indicator': {
                                        height: '100%',
                                        borderRadius: '50px',
                                        bgcolor: '#960000',
                                        zIndex: 0,
                                    },
                                    '& .MuiTab-root': {
                                        minWidth: { xs: 130, md: 170 },
                                        borderRadius: '50px',
                                        zIndex: 1,
                                        transition: 'all 0.3s ease',
                                        fontWeight: 600,
                                        fontSize: '0.88rem',
                                        minHeight: 44,
                                        color: 'text.secondary',
                                        '&.Mui-selected': {
                                            color: '#ffffff',
                                        },
                                    },
                                }}
                            >
                                <Tab label="단원 모집 안내" />
                                <Tab label="자격증 과정 안내" />
                            </Tabs>
                        </Box>
                    </Box>
                </Box>

                {/* Sliding Content */}
                <Box sx={{ position: 'relative', minHeight: { xs: 'auto', sm: 800, md: 600 } }}>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={contentVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 250, damping: 30 },
                                opacity: { duration: 0.25 },
                            }}
                            style={{
                                width: '100%',
                                position: 'absolute',
                            }}
                        >
                            {activeTab === 0 ? (
                                /* ────── Member Recruitment ────── */
                                <Paper
                                    sx={{
                                        p: { xs: 4, md: 7 },
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 50px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(49,70,107,0.06)',
                                        bgcolor: '#ffffff',
                                    }}
                                >
                                    <Grid container spacing={5}>
                                        <Grid size={{ xs: 12, md: 7 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                                <GroupsIcon sx={{ color: '#960000', fontSize: 30 }} />
                                                <Typography
                                                    variant="h4"
                                                    sx={{ fontSize: '1.35rem', fontWeight: 700, color: 'text.primary' }}
                                                >
                                                    신입 단원 모집
                                                </Typography>
                                            </Box>

                                            {/* Main Headline */}
                                            <Box
                                                sx={{
                                                    mb: 4,
                                                    pl: 2,
                                                    borderLeft: '3px solid #960000',
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    className="cjk-text"
                                                    sx={{
                                                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                                                        fontWeight: 600,
                                                        color: '#960000',
                                                        lineHeight: 1.7,
                                                        fontFamily: '"Noto Serif KR", serif',
                                                    }}
                                                >
                                                    "전통예술을 통해 행복한 소통과<br />삶의 즐거움을 함께 나눌 단원을 모집합니다"
                                                </Typography>
                                            </Box>

                                            {/* Welcome Audience */}
                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ mb: 2, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', fontSize: '0.8rem' }}
                                                >
                                                    이런 분들을 환영합니다
                                                </Typography>
                                                <Grid container spacing={1.5}>
                                                    {WELCOME_AUDIENCE.map((text, idx) => (
                                                        <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CheckCircleOutlineIcon sx={{ color: '#31466b', fontSize: 17, opacity: 0.75 }} />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ color: 'text.primary', opacity: 0.8, fontSize: '0.85rem' }}
                                                                >
                                                                    {text}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>

                                            {/* CTA Quote */}
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    bgcolor: 'rgba(150,0,0,0.03)',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(150,0,0,0.08)',
                                                    mb: 4,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    className="cjk-justify"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontStyle: 'italic',
                                                        textAlign: 'center',
                                                        lineHeight: 1.9,
                                                        fontSize: { xs: '0.82rem', md: '0.88rem' },
                                                    }}
                                                >
                                                    "전통예술을 통해 새로운 삶의 활력을 찾고,<br />행복한 소통을 나누고 싶으신 분들의 지원을 기다립니다"
                                                </Typography>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                onClick={scrollToContact}
                                                fullWidth
                                                sx={{
                                                    py: 1.8,
                                                    fontSize: '0.92rem',
                                                    fontWeight: 600,
                                                    bgcolor: '#960000',
                                                    borderRadius: '6px',
                                                    boxShadow: '0 4px 20px rgba(150,0,0,0.25)',
                                                    '&:hover': {
                                                        bgcolor: '#7a0000',
                                                        boxShadow: '0 6px 25px rgba(150,0,0,0.35)',
                                                    },
                                                }}
                                            >
                                                지원 및 상담 문의하기
                                            </Button>
                                        </Grid>

                                        {/* Recruitment Info Panel */}
                                        <Grid size={{ xs: 12, md: 5 }}>
                                            <Box
                                                sx={{
                                                    height: 'auto',
                                                    minHeight: 280,
                                                    bgcolor: 'rgba(49,70,107,0.03)',
                                                    borderRadius: '6px',
                                                    p: 3.5,
                                                    border: '1px dashed rgba(49,70,107,0.15)',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ mb: 2, fontWeight: 700, color: '#31466b', fontSize: '0.85rem' }}
                                                >
                                                    상세 모집 요강
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        color: 'text.secondary',
                                                        lineHeight: 1.9,
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {recruitmentData.recruitment_info || '관리자 페이지에서 상세 내용을 입력해 주세요.'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ) : (
                                /* ────── Certification Guide ────── */
                                <Paper
                                    sx={{
                                        p: { xs: 4, md: 7 },
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 50px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(49,70,107,0.06)',
                                        bgcolor: '#ffffff',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                        <SchoolIcon sx={{ color: '#533b72', fontSize: 30 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{ fontSize: '1.35rem', fontWeight: 700, color: 'text.primary' }}
                                        >
                                            자격증 과정 안내
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={5}>
                                        <Grid size={{ xs: 12, md: 8 }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    color: 'text.secondary',
                                                    lineHeight: 2,
                                                    fontSize: '0.92rem',
                                                }}
                                            >
                                                {recruitmentData.certification_info || '자격증 과정에 대한 정보를 준비 중입니다.\n\n관리자 페이지에서 내용을 입력해 주세요.'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Box
                                                sx={{
                                                    p: 3.5,
                                                    border: '1px solid',
                                                    borderColor: 'rgba(83,59,114,0.15)',
                                                    borderRadius: '6px',
                                                    bgcolor: 'rgba(83,59,114,0.02)',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ mb: 2.5, color: '#533b72', fontWeight: 700, fontSize: '0.85rem' }}
                                                >
                                                    📞 문의처
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <PhoneIcon sx={{ fontSize: 16, color: '#960000' }} />
                                                        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.88rem' }}>
                                                            010-2949-2247
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <EmailIcon sx={{ fontSize: 16, color: '#31466b' }} />
                                                        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                                                            dancersunhee@hanmail.net
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
}
