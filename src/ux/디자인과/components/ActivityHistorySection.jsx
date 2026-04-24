import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../system/utils/supabase';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ITEMS_PER_PAGE = 3;
const NOTICES_PER_PAGE = 3;

export default function ActivityHistorySection() {
    const [activities, setActivities] = useState([]);
    const [notices, setNotices] = useState([]);
    const [actPage, setActPage] = useState(0);
    const [notPage, setNotPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { data: actData } = await supabase
                .from('activities')
                .select('*')
                .order('event_date', { ascending: false });
            const { data: ntcData } = await supabase
                .from('side_notices')
                .select('*')
                .order('created_at', { ascending: false });
            if (actData) setActivities(actData);
            if (ntcData) setNotices(ntcData);
        };
        fetchData();
    }, []);

    const actTotalPages = Math.max(1, Math.ceil(activities.length / ITEMS_PER_PAGE));
    const notTotalPages = Math.max(1, Math.ceil(notices.length / NOTICES_PER_PAGE));

    const pagedActivities = activities.slice(actPage * ITEMS_PER_PAGE, (actPage + 1) * ITEMS_PER_PAGE);
    const pagedNotices = notices.slice(notPage * NOTICES_PER_PAGE, (notPage + 1) * NOTICES_PER_PAGE);

    return (
        <Box
            id="history"
            sx={{
                py: { xs: 13, md: 7 },
                bgcolor: '#fdfbf6',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: '-5%',
                left: '-5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(49,70,107,0.04) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography sx={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        color: '#960000',
                        textTransform: 'uppercase',
                        mb: 0.4,
                        display: 'block',
                    }}>
                        Activity History
                    </Typography>
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '1.8rem', md: '2.3rem' },
                        color: 'text.primary',
                        mb: 0.4,
                    }}>
                        활동 내역
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                        아르선의 다양한 공연 및 예술 활동 내역을 확인하세요
                    </Typography>
                </Box>

                <Grid container spacing={5}>
                    {/* Left: Activities */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                            <Box sx={{ width: 3, height: 20, bgcolor: '#960000', borderRadius: '2px' }} />
                            <Typography variant="h5" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                                주요 활동
                            </Typography>
                            <Chip
                                label={`${activities.length}건`}
                                size="small"
                                sx={{ bgcolor: 'rgba(150,0,0,0.07)', color: '#960000', fontSize: '0.68rem', fontWeight: 600, height: 22 }}
                            />
                        </Box>

                        <AnimatePresence mode="wait">
                            {pagedActivities.length > 0 ? (
                                <motion.div
                                    key={actPage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {pagedActivities.map((act) => (
                                            <Card
                                                key={act.id}
                                                sx={{
                                                    bgcolor: '#ffffff',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.09)', transform: 'translateY(-2px)' },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex' }}>
                                                    {act.poster_url && (
                                                        <Box sx={{ width: { xs: 90, sm: 130 }, minHeight: 160, flexShrink: 0, overflow: 'hidden' }}>
                                                            <img src={act.poster_url} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                        </Box>
                                                    )}
                                                    <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.05rem' }, mb: 1.5, color: 'text.primary', lineHeight: 1.4 }}>
                                                            {act.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                                            {act.organizer && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PeopleIcon sx={{ fontSize: 14, color: '#31466b', opacity: 0.7 }} />
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                                                                        <strong style={{ color: '#31466b', marginRight: 4 }}>주최</strong>{act.organizer}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {act.event_date && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <EventIcon sx={{ fontSize: 14, color: '#960000', opacity: 0.7 }} />
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                                                                        <strong style={{ color: '#960000', marginRight: 4 }}>일시</strong>{act.event_date}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {act.location && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <LocationOnIcon sx={{ fontSize: 14, color: '#533b72', opacity: 0.7 }} />
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                                                                        <strong style={{ color: '#533b72', marginRight: 4 }}>장소</strong>{act.location}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {act.runtime && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.7 }} />
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                                                                        <strong style={{ marginRight: 4 }}>런닝타임</strong>{act.runtime}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {act.sponsor && (
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.73rem', opacity: 0.7, pl: 2.5 }}>
                                                                    후원: {act.sponsor}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </motion.div>
                            ) : (
                                <Box sx={{ py: 8, textAlign: 'center', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.01)' }}>
                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', opacity: 0.5 }}>
                                        등록된 활동 내역이 없습니다
                                    </Typography>
                                </Box>
                            )}
                        </AnimatePresence>

                        {/* Activity Pagination */}
                        {actTotalPages > 1 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 4 }}>
                                <IconButton
                                    onClick={() => setActPage((p) => Math.max(0, p - 1))}
                                    disabled={actPage === 0}
                                    size="small"
                                    sx={{ border: '1px solid rgba(150,0,0,0.2)', color: '#960000', '&:disabled': { opacity: 0.3 }, '&:hover': { bgcolor: 'rgba(150,0,0,0.06)', borderColor: '#960000' } }}
                                >
                                    <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                                <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', minWidth: 60, textAlign: 'center' }}>
                                    {actPage + 1} / {actTotalPages}
                                </Typography>
                                <IconButton
                                    onClick={() => setActPage((p) => Math.min(actTotalPages - 1, p + 1))}
                                    disabled={actPage === actTotalPages - 1}
                                    size="small"
                                    sx={{ border: '1px solid rgba(150,0,0,0.2)', color: '#960000', '&:disabled': { opacity: 0.3 }, '&:hover': { bgcolor: 'rgba(150,0,0,0.06)', borderColor: '#960000' } }}
                                >
                                    <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
                        )}
                    </Grid>

                    {/* Right: Notices */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                <Box sx={{ width: 3, height: 20, bgcolor: '#31466b', borderRadius: '2px' }} />
                                <Typography variant="h5" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                                    공지사항
                                </Typography>
                            </Box>

                            <Box sx={{ bgcolor: '#31466b', color: 'white', p: 4, borderRadius: '8px', boxShadow: '0 10px 40px rgba(49,70,107,0.2)' }}>
                                <Typography variant="subtitle2" sx={{ mb: 3, opacity: 0.6, letterSpacing: '0.15em', fontSize: '0.65rem' }}>
                                    NOTICE
                                </Typography>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={notPage}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                            {pagedNotices.map((note, idx) => (
                                                <Box key={note.id}>
                                                    <Typography variant="body2" className="cjk-text" sx={{ lineHeight: 1.8, fontSize: { xs: '0.82rem', md: '0.85rem' }, color: 'rgba(255,255,255,0.9)' }}>
                                                        {note.content}
                                                    </Typography>
                                                    {idx < pagedNotices.length - 1 && (
                                                        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.12)' }} />
                                                    )}
                                                </Box>
                                            ))}
                                            {notices.length === 0 && (
                                                <Typography variant="body2" sx={{ opacity: 0.45, fontSize: '0.85rem' }}>
                                                    등록된 공지사항이 없습니다.
                                                </Typography>
                                            )}
                                        </Box>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Notice Pagination */}
                                {notTotalPages > 1 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
                                        <IconButton
                                            onClick={() => setNotPage((p) => Math.max(0, p - 1))}
                                            disabled={notPage === 0}
                                            size="small"
                                            sx={{ border: '1px solid rgba(255,255,255,0.25)', color: 'white', '&:disabled': { opacity: 0.25 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                        >
                                            <ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
                                        </IconButton>
                                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', minWidth: 48, textAlign: 'center' }}>
                                            {notPage + 1} / {notTotalPages}
                                        </Typography>
                                        <IconButton
                                            onClick={() => setNotPage((p) => Math.min(notTotalPages - 1, p + 1))}
                                            disabled={notPage === notTotalPages - 1}
                                            size="small"
                                            sx={{ border: '1px solid rgba(255,255,255,0.25)', color: 'white', '&:disabled': { opacity: 0.25 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                        >
                                            <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            {/* Contact CTA */}
                            <Box sx={{ mt: 3, p: 3, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.82rem', lineHeight: 1.7 }}>
                                    공연 및 행사 문의가 있으신가요?
                                </Typography>
                                <Button
                                    variant="text"
                                    endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                                    onClick={() => {
                                        const el = document.getElementById('contact');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    sx={{ color: '#960000', fontSize: '0.82rem', fontWeight: 600, '&:hover': { bgcolor: 'rgba(150,0,0,0.04)' } }}
                                >
                                    문의하기
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
