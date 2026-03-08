import { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAdminSections } from '../../../system/hooks/useAdminData';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '../../../system/utils/youtube';

export default function HeroSection() {
    const theme = useTheme();
    const sectionRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // ✅ 관리자 데이터에서 hero 영상 목록 가져오기
    const { sections } = useAdminSections();
    const heroSection = sections.find((s) => s.key === 'hero');
    const videoUrls = useMemo(() => heroSection?.videoUrls ?? [], [heroSection]);

    // 비디오 스크롤러 상태
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const autoPlayTimerRef = useRef(null);

    // 자동 전환 (8초마다)
    useEffect(() => {
        if (videoUrls.length <= 1) return;

        const startTimer = () => {
            autoPlayTimerRef.current = setInterval(() => {
                setIsFading(true);
                setTimeout(() => {
                    setActiveVideoIndex((prev) => (prev + 1) % videoUrls.length);
                    setIsFading(false);
                }, 800); // fade out 시간
            }, 8000);
        };

        startTimer();
        return () => clearInterval(autoPlayTimerRef.current);
    }, [videoUrls.length]);

    // 인디케이터 클릭으로 수동 전환
    const handleIndicatorClick = (idx) => {
        if (idx === activeVideoIndex) return;
        clearInterval(autoPlayTimerRef.current);
        setIsFading(true);
        setTimeout(() => {
            setActiveVideoIndex(idx);
            setIsFading(false);
            // 타이머 재시작
            if (videoUrls.length > 1) {
                autoPlayTimerRef.current = setInterval(() => {
                    setIsFading(true);
                    setTimeout(() => {
                        setActiveVideoIndex((prev) => (prev + 1) % videoUrls.length);
                        setIsFading(false);
                    }, 800);
                }, 8000);
            }
        }, 800);
    };

    // 현재 활성 영상의 유튜브 ID와 썸네일
    const activeUrl = videoUrls[activeVideoIndex] ?? null;
    const activeVideoId = activeUrl ? getYouTubeVideoId(activeUrl) : null;
    const activeThumbnailUrl = activeUrl ? getYouTubeThumbnailUrl(activeUrl, 'maxresdefault') : null;

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
            if (sectionHeight <= 0) return;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Text appear thresholds
    const logoOpacity = Math.min(1, scrollProgress * 4);
    const sloganOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.25) * 4));
    const sloganY = Math.max(0, 30 - (scrollProgress - 0.25) * 120);
    const scrollArrowOpacity = Math.max(0, 1 - scrollProgress * 3);

    return (
        <Box
            id="hero"
            ref={sectionRef}
            sx={{
                position: 'relative',
                height: '400vh',
                width: '100%',
            }}
        >
            {/* Sticky viewport container */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* ✅ 배경 영상: 유튜브 iframe (관리자 등록 시) */}
                {activeVideoId && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: '-60px', // 브라우저 iframe 마스킹용
                            opacity: isFading ? 0 : 1,
                            transition: 'opacity 0.8s ease-in-out',
                            zIndex: 1,
                        }}
                    >
                        {/* 로딩 중 썸네일 배경 */}
                        {activeThumbnailUrl && (
                            <Box
                                component="img"
                                src={activeThumbnailUrl}
                                alt=""
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 0,
                                }}
                            />
                        )}
                        <Box
                            component="iframe"
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=1&loop=1&playlist=${activeVideoId}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playsinline=1&enablejsapi=0&origin=${window.location.origin}`}
                            title="배경 공연 영상"
                            allow="autoplay; encrypted-media"
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}
                        />
                    </Box>
                )}

                {/* Animated gradient placeholder (영상이 없을 때 or 오버레이) */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        background: activeVideoId
                            ? `linear-gradient(180deg, ${theme.palette.background.default}99 0%, ${theme.palette.background.default}40 40%, ${theme.palette.background.default}aa 100%)`
                            : `
                                radial-gradient(
                                  ellipse at ${30 + scrollProgress * 40}% ${40 + scrollProgress * 20}%,
                                  ${theme.palette.primary.main}${Math.floor((0.05 + scrollProgress * 0.1) * 255).toString(16).padStart(2, '0')} 0%,
                                  transparent 50%
                                ),
                                radial-gradient(
                                  ellipse at ${70 - scrollProgress * 30}% ${60 - scrollProgress * 10}%,
                                  ${theme.palette.info.main}${Math.floor((0.05 + scrollProgress * 0.1) * 255).toString(16).padStart(2, '0')} 0%,
                                  transparent 45%
                                ),
                                radial-gradient(
                                  ellipse at 50% 80%,
                                  ${theme.palette.secondary.main}${Math.floor((0.05 + scrollProgress * 0.1) * 255).toString(16).padStart(2, '0')} 0%,
                                  transparent 40%
                                ),
                                linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)
                            `,
                        transition: 'background 0.05s linear',
                    }}
                />

                {/* Floating particles */}
                <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                width: `${1 + Math.random() * 2}px`,
                                height: `${1 + Math.random() * 2}px`,
                                borderRadius: '50%',
                                bgcolor: i % 3 === 0
                                    ? 'rgba(150, 0, 0, 0.4)'
                                    : i % 3 === 1
                                        ? 'rgba(83, 59, 114, 0.3)'
                                        : 'rgba(240, 236, 228, 0.15)',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float-particle ${6 + Math.random() * 8}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.4 + Math.random() * 0.6,
                            }}
                        />
                    ))}
                </Box>

                {/* Decorative grid lines */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 3,
                        opacity: 0.03 + scrollProgress * 0.02,
                        backgroundImage: `
              linear-gradient(${theme.palette.text.primary}1a 1px, transparent 1px),
              linear-gradient(90deg, ${theme.palette.text.primary}1a 1px, transparent 1px)
            `,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Content overlay */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: 3,
                    }}
                >
                    {/* Top decorative line */}
                    <Box
                        sx={{
                            width: `${40 + scrollProgress * 60}px`,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(150, 0, 0, 0.6), transparent)',
                            mb: 4,
                            opacity: logoOpacity,
                            transition: 'width 0.1s linear',
                        }}
                    />

                    {/* Logo text with CharacterStagger */}
                    <Box
                        sx={{
                            mb: 1,
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{ display: 'block', mb: 0.5 }}>
                            {"경기도 지정 전문예술법인".split('').map((char, i) => {
                                const charStart = i * 0.012;
                                const charSpeed = 6;
                                const charProgress = Math.min(1, Math.max(0, (scrollProgress - charStart) * charSpeed));
                                return (
                                    <Typography
                                        key={`top-${i}`}
                                        component="span"
                                        variant="h1"
                                        sx={{
                                            display: 'inline-block',
                                            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' },
                                            fontWeight: 400,
                                            fontFamily: '"Noto Sans KR", sans-serif',
                                            color: theme.palette.text.secondary,
                                            opacity: charProgress,
                                            transform: `translateY(${(1 - charProgress) * 20}px)`,
                                            transition: 'transform 0.05s linear, opacity 0.05s linear',
                                            letterSpacing: '0.05em',
                                            textShadow: activeVideoId ? '0 2px 10px rgba(0,0,0,0.4)' : 'none',
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </Typography>
                                );
                            })}
                        </Box>
                        <Box sx={{ display: 'block' }}>
                            {"(사)아트컴퍼니 아르-선".split('').map((char, i) => {
                                const isPrefix = i < 3;
                                const globalIndex = i + 13;
                                const charStart = globalIndex * 0.015;
                                const charSpeed = 6;
                                const charProgress = Math.min(1, Math.max(0, (scrollProgress - charStart) * charSpeed));
                                return (
                                    <Typography
                                        key={`main-${i}`}
                                        component="span"
                                        variant="h1"
                                        sx={{
                                            display: 'inline-block',
                                            fontSize: { xs: '3rem', sm: '4.5rem', md: '5.2rem' },
                                            fontWeight: 700,
                                            color: theme.palette.primary.main,
                                            opacity: charProgress,
                                            transform: `translateY(${(1 - charProgress) * 40}px) rotate(${(1 - charProgress) * 10}deg)`,
                                            transition: 'transform 0.05s linear, opacity 0.05s linear',
                                            letterSpacing: isPrefix ? '0em' : '0.04em',
                                            whiteSpace: char === ' ' ? 'pre' : 'normal',
                                            textShadow: activeVideoId ? '0 2px 20px rgba(0,0,0,0.6)' : 'none',
                                            verticalAlign: 'baseline',
                                            mr: i === 2 ? 1 : 0,
                                        }}
                                    >
                                        {char}
                                    </Typography>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* English subtitle */}
                    <Typography
                        sx={{
                            fontFamily: '"Noto Sans KR", sans-serif',
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            fontWeight: 300,
                            color: theme.palette.text.secondary,
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            opacity: logoOpacity,
                            mb: 5,
                            textShadow: activeVideoId ? '0 1px 10px rgba(0,0,0,0.5)' : 'none',
                        }}
                    >
                        Art Company ART-SUN
                    </Typography>

                    {/* Slogan */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.2rem' },
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            fontWeight: 300,
                            opacity: sloganOpacity,
                            transform: `translateY(${sloganY}px)`,
                            transition: 'transform 0.05s linear, opacity 0.05s linear',
                            letterSpacing: '0.08em',
                            lineHeight: 1.9,
                            maxWidth: '500px',
                            textShadow: activeVideoId ? '0 2px 16px rgba(0,0,0,0.6)' : 'none',
                        }}
                    >
                        전통의 울림, 현대의 몸짓으로 피어나다
                    </Typography>

                    {/* Bottom decorative line */}
                    <Box
                        sx={{
                            width: `${20 + scrollProgress * 80}px`,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(83, 59, 114, 0.4), transparent)',
                            mt: 5,
                            opacity: sloganOpacity,
                        }}
                    />
                </Box>

                {/* ✅ 비디오 스크롤러 인디케이터 (다시 추가) */}
                {videoUrls.length > 1 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 90,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1.2,
                            zIndex: 20,
                            opacity: scrollArrowOpacity,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        {videoUrls.map((_, idx) => (
                            <Box
                                key={idx}
                                onClick={() => handleIndicatorClick(idx)}
                                sx={{
                                    width: idx === activeVideoIndex ? 24 : 8,
                                    height: 8,
                                    borderRadius: '4px',
                                    bgcolor: idx === activeVideoIndex ? theme.palette.primary.main : theme.palette.divider,
                                    cursor: 'pointer',
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        bgcolor: idx === activeVideoIndex ? '#960000' : 'rgba(240,236,228,0.5)',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Scroll indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        opacity: scrollArrowOpacity,
                        transition: 'opacity 0.1s linear',
                        zIndex: 20,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Noto Sans KR", sans-serif',
                            fontSize: '0.65rem',
                            fontWeight: 300,
                            letterSpacing: '0.25em',
                            color: theme.palette.text.secondary,
                            textTransform: 'uppercase',
                        }}
                    >
                        Scroll
                    </Typography>
                    <KeyboardArrowDownIcon
                        sx={{
                            fontSize: '1.2rem',
                            color: theme.palette.text.secondary,
                            animation: 'bounce-arrow 2s ease-in-out infinite',
                        }}
                    />
                </Box>
            </Box>

            {/* Keyframe Animations */}
            <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -20px) scale(1.2); }
          50% { transform: translate(-5px, -35px) scale(0.8); }
          75% { transform: translate(15px, -15px) scale(1.1); }
        }

        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
        </Box>
    );
}
