import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import { supabase } from '../../../system/utils/supabase';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';

export default function DonationSection() {
    const [donationData, setDonationData] = useState({ bank_name: '', account_number: '', account_holder: '', message: '' });
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [settingsRes, donorsRes] = await Promise.all([
                supabase.from('site_settings').select('*').eq('key', 'donation').single(),
                supabase.from('donors').select('name, donated_at, message, amount').eq('is_visible', true).order('donated_at', { ascending: false }),
            ]);
            if (settingsRes.data) setDonationData(settingsRes.data.value);
            if (donorsRes.data) setDonors(donorsRes.data);
        };
        fetchData();
    }, []);

    return (
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.default' }} id="donation">
            <Container maxWidth="md">

                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="sectionLabel"
                        sx={{ color: 'primary.main', mb: 0.4, display: 'block' }} // 간격 80% 축소
                    >
                        SUPPORT US
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4, color: 'text.primary' }}
                    >
                        후원 안내
                    </Typography>
                </Box>

                {/* 아르선 후원자 전당 */}
                {donors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            {/* 장식 — 별 3개 곡선 배치 */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 0.8, mb: 1.5, height: 24 }}>
                                <StarIcon sx={{ fontSize: 10, color: '#960000', opacity: 0.4, transform: 'translateY(4px)' }} />
                                <StarIcon sx={{ fontSize: 16, color: '#960000', opacity: 0.7, transform: 'translateY(-2px)' }} />
                                <StarIcon sx={{ fontSize: 10, color: '#960000', opacity: 0.4, transform: 'translateY(4px)' }} />
                            </Box>

                            <Typography sx={{
                                fontSize: '0.68rem',
                                fontWeight: 500,
                                letterSpacing: '0.3em',
                                color: '#960000',
                                textTransform: 'uppercase',
                                mb: 0.2, // 간격 80% 축소
                            }}>
                                Our Supporters
                            </Typography>

                            <Typography sx={{
                                fontFamily: '"Noto Serif KR", serif',
                                fontSize: { xs: '1.1rem', md: '1.3rem' },
                                fontWeight: 700,
                                color: 'text.primary',
                                letterSpacing: '0.04em',
                                mb: 4,
                            }}>
                                아르선 후원자 전당
                            </Typography>

                            {/* 이름 나열 */}
                            <Box sx={{ lineHeight: 2.4, mb: 3, maxWidth: 700, mx: 'auto' }}>
                                {donors.map((donor, idx) => (
                                    <motion.span
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                                        style={{ display: 'inline' }}
                                    >
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: '"Noto Serif KR", serif',
                                                fontWeight: 600,
                                                fontSize: { xs: '0.9rem', md: '1rem' },
                                                color: 'text.primary',
                                                mx: 0.36, // 간격 10% 추가 축소
                                                display: 'inline-block', // 이름이 통째로 넘어가게 설정
                                                whiteSpace: 'nowrap', // 이름 중간에서 줄바꿈 방지
                                            }}
                                        >
                                            {donor.name}
                                        </Typography>

                                    </motion.span>
                                ))}
                            </Box>

                            <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.5, fontSize: '0.72rem' }}>
                                * 노출 동의하신 분들의 성함만 표기됩니다
                            </Typography>
                        </Box>
                    </motion.div>
                )}

                {/* 후원 계좌 카드 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            p: { xs: 3, md: 4.5 },
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            width: { xs: '100%', md: '80%' },
                            mx: 'auto',
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                    sx={{
                                        mb: 2,
                                        fontWeight: 700,
                                        fontFamily: '"Shilla", "Noto Serif KR", serif',
                                        color: 'text.primary',
                                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                                    }}
                                >
                                    아르선을 응원해 주세요
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.6,
                                        mb: 2,
                                        fontSize: '0.85rem',
                                        wordBreak: 'keep-all',
                                    }}
                                >
                                    {donationData.message || '아르선의 예술 활동을 위해 따뜻한 마음을 나누어 주세요. 보내주신 후원금은 더 좋은 공연과 교육을 위해 소중히 사용됩니다.'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box
                                    sx={{
                                        bgcolor: '#fdfbf6',
                                        p: 3,
                                        borderRadius: '2px',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <WalletIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: '"Noto Serif KR", serif',
                                                color: 'secondary.main',
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            후원 계좌
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>은행명</Typography>
                                            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>{donationData.bank_name || '-'}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>계좌번호</Typography>
                                            <Typography sx={{ fontWeight: 700, letterSpacing: '0.05em', color: 'primary.main', fontSize: '1rem' }}>{donationData.account_number || '-'}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>예금주</Typography>
                                            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>{donationData.account_holder || '-'}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </motion.div>

            </Container>
        </Box>
    );
}
