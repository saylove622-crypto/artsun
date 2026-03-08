import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { supabase } from '../../../system/utils/supabase';
import MapIcon from '@mui/icons-material/Map';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';

export default function LocationSection() {
    // 주소 및 지도 정보를 하드코딩으로 변경 (사용자 요청)
    const locationData = {
        address: '경기도 화성시 능동 710-2 병점 성호아파트 상가동 지하1층',
        map_url: 'https://naver.me/59lP7mey'
    };

    return (
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: '#fdfaf6' }} id="location">
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="sectionLabel" sx={{ color: 'primary.main', mb: 0.4, display: 'block' }}>LOCATION</Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>오시는 길</Typography>
                </Box>

                <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    {/* Address Display - Now at the top of map card area */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 500,
                                lineHeight: 1.6,
                                wordBreak: 'keep-all',
                                mb: 1
                            }}
                        >
                            {locationData.address || '주소가 등록되지 않았습니다.'}
                        </Typography>

                        {locationData.map_url && (
                            <Button
                                variant="text"
                                size="small"
                                href={locationData.map_url}
                                target="_blank"
                                sx={{
                                    px: 2,
                                    borderRadius: '4px',
                                    color: 'primary.main',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(150,0,0,0.04)',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                네이버 지도로 보기
                            </Button>
                        )}
                    </Box>

                    {/* Map Card */}
                    <Paper sx={{
                        height: { xs: 300, md: 450 },
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#fdfbf6',
                    }}>
                        <iframe
                            title="ArSeon Location"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent('경기도 화성시 능동 710-2 성호아파트 상가')}&hl=ko&z=16&output=embed`}
                        ></iframe>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
