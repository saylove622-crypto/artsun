import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Button, Modal, IconButton, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../../system/utils/supabase';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../../system/utils/youtube';

const YOUTUBE_CHANNELS = [
    {
        label: '공식 공연 채널 바로가기',
        url: 'https://www.youtube.com/@%EC%82%AC%EB%8B%A8%EB%B2%95%EC%9D%B8%EC%95%84%ED%8A%B8%EC%BB%B4%ED%8D%BC%EB%8B%88%EC%95%84',
        color: '#960000',
    },
    {
        label: '일상 난타 채널 바로가기',
        url: 'https://www.youtube.com/@imta-964',
        color: '#31466b',
    },
];

/** 유튜브 썸네일 카드 컴포넌트 */
function VideoCard({ videoUrl, onClick }) {
    const theme = useTheme();
    const [thumbError, setThumbError] = useState(false);
    const thumbnailUrl = getYouTubeThumbnailUrl(videoUrl, 'hqdefault');

    return (
        <Box
            onClick={onClick}
            sx={{
                aspectRatio: '16/9',
                borderRadius: '2px',
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                    borderColor: 'rgba(150,0,0,0.4)',
                    transform: 'scale(1.02)',
                    '& .play-overlay': { opacity: 1 },
                    '& .play-icon': { transform: 'scale(1.15)' },
                },
            }}
        >
            {/* Thumbnail */}
            {thumbnailUrl && !thumbError ? (
                <Box
                    component="img"
                    src={thumbnailUrl}
                    alt="공연 영상 썸네일"
                    onError={() => setThumbError(true)}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <PlayCircleOutlineIcon sx={{ fontSize: 40, color: theme.palette.divider }} />
                </Box>
            )}

            {/* Overlay gradient */}
            <Box
                className="play-overlay"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Play icon */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <PlayCircleFilledIcon
                    className="play-icon"
                    sx={{
                        fontSize: 52,
                        color: 'rgba(255,255,255,0.85)',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                        transition: 'transform 0.3s ease',
                    }}
                />
            </Box>
        </Box>
    );
}

export default function GallerySection() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0); // 0: 정기/기획, 1: 일반
    const [videoCategories, setVideoCategories] = useState({ regular: [], general: [] });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'performance_categories')
                .single();
            if (data) setVideoCategories(data.value);
        };
        fetchSettings();
    }, []);

    const currentVideos = activeTab === 0 ? videoCategories.regular : videoCategories.general;

    // 모달 상태
    const [activeVideoUrl, setActiveVideoUrl] = useState(null);
    const activeEmbedUrl = activeVideoUrl ? getYouTubeEmbedUrl(activeVideoUrl) : null;

    return (
        <Box
            id="gallery"
            sx={{
                py: { xs: 5, md: 7 },
                position: 'relative',
            }}
        >
            {/* Section divider */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    maxWidth: '1000px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(49,70,107,0.06), transparent)',
                }}
            />

            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                    <Typography
                        sx={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            letterSpacing: '0.3em',
                            color: '#533b72',
                            textTransform: 'uppercase',
                            mb: 0.4,
                        }}
                    >
                        Video Gallery
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, color: 'text.primary', mb: 2 }}
                    >
                        영상갤러리
                    </Typography>
                    <Box
                        sx={{
                            width: '40px',
                            height: '1.5px',
                            background: 'linear-gradient(90deg, #533b72, #31466b)',
                            mx: 'auto',
                        }}
                    />
                </Box>

                {/* YouTube channel buttons */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: { xs: 6, md: 8 } }}>
                    {YOUTUBE_CHANNELS.map((ch, i) => (
                        <Button
                            key={i}
                            variant="outlined"
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<OpenInNewIcon sx={{ fontSize: '0.9rem !important' }} />}
                            sx={{
                                borderColor: `${ch.color}55`,
                                color: 'text.primary',
                                fontSize: '0.85rem',
                                px: 3,
                                py: 1.2,
                                '&:hover': {
                                    borderColor: ch.color,
                                    bgcolor: `${ch.color}11`,
                                },
                            }}
                        >
                            {ch.label}
                        </Button>
                    ))}
                </Box>

                {/* ✅ 탭: 정기/기획공연 | 일반공연 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        centered
                        sx={{
                            '& .MuiTabs-indicator': { bgcolor: '#533b72', height: '2px' },
                            '& .MuiTab-root': {
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                mx: 1,
                                color: 'text.secondary',
                                '&.Mui-selected': { color: '#533b72' },
                            },
                        }}
                    >
                        <Tab label="정기 및 기획공연" />
                        <Tab label="일반공연" />
                    </Tabs>
                </Box>

                {/* ✅ 영상 그리드 */}
                {currentVideos && currentVideos.length > 0 ? (
                    <Grid container spacing={3}>
                        {currentVideos.map((url, idx) => (
                            <Grid size={{ xs: 12, sm: currentVideos.length === 1 ? 12 : 6, md: currentVideos.length === 1 ? 8 : 4 }} key={idx}
                                sx={currentVideos.length === 1 ? { mx: 'auto' } : {}}>
                                <VideoCard
                                    videoUrl={url}
                                    onClick={() => setActiveVideoUrl(url)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    /* Placeholder */
                    <Grid container spacing={3}>
                        {[1, 2, 3].map((idx) => (
                            <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                                <Box
                                    sx={{
                                        aspectRatio: '16/9',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: '2px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.5,
                                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                                        transition: 'border-color 0.3s ease',
                                        '&:hover': { borderColor: `${theme.palette.primary.main}44` },
                                    }}
                                >
                                    <PlayCircleOutlineIcon sx={{ fontSize: 40, color: theme.palette.divider }} />
                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', opacity: 0.4, letterSpacing: '0.05em' }}>
                                        (관리자 페이지에서 영상 URL 등록)
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* ✅ 영상 재생 모달 */}
            <Modal
                open={!!activeVideoUrl}
                onClose={() => setActiveVideoUrl(null)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 900,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        outline: 'none',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
                    }}
                >
                    {/* Close button */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1.2,
                            borderBottom: '1px solid rgba(240,236,228,0.06)',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', opacity: 0.7, fontFamily: '"Noto Serif KR", serif' }}>
                            공연 영상
                        </Typography>
                        <IconButton
                            onClick={() => setActiveVideoUrl(null)}
                            size="small"
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    {/* iFrame */}
                    {activeEmbedUrl && (
                        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                            <Box
                                component="iframe"
                                src={`${activeEmbedUrl}?autoplay=1`}
                                title="공연 영상"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
