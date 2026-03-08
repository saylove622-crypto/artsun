import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { useAdminSections } from '../../../system/hooks/useAdminData';


const PERFORMANCES = [
    {
        title: '한국 전통무용',
        desc: '우리 민족의 혼과 정서가 담긴 한국 전통무용. 아름다운 한복과 섬세한 춤선으로 전통의 기품과 우아함을 무대 위에 펼칩니다.',
        color: '#31466b',
        gradient: 'linear-gradient(135deg, rgba(49,70,107,0.12) 0%, rgba(49,70,107,0.04) 100%)',
        imageIndex: 0,
    },
    {
        title: '창작무용',
        desc: '전통 춤의 정신을 바탕으로 현대적 안무와 무대 연출을 더한 창작무용. 독창적인 움직임으로 새로운 예술적 서사를 만들어냅니다.',
        color: '#533b72',
        gradient: 'linear-gradient(135deg, rgba(83,59,114,0.12) 0%, rgba(83,59,114,0.04) 100%)',
        imageIndex: 1,
    },
    {
        title: '타악 · 난타 퍼포먼스',
        desc: '역동적인 리듬과 에너지가 넘치는 타악 퍼포먼스. 전통 장단을 기반으로 현대적 비트를 결합한 난타 공연은 관객의 심장을 뛰게 합니다.',
        color: '#960000',
        gradient: 'linear-gradient(135deg, rgba(150,0,0,0.12) 0%, rgba(150,0,0,0.04) 100%)',
        imageIndex: 2,
    },
    {
        title: '장구 · 사물놀이',
        desc: '장구, 꽹과리, 북, 징의 사물놀이와 장구 퍼포먼스. 흥겨운 가락은 관객 모두를 하나로 이어주는 신명의 축제입니다.',
        color: '#960000',
        gradient: 'linear-gradient(135deg, rgba(150,0,0,0.08) 0%, rgba(49,70,107,0.08) 100%)',
        imageIndex: 3,
    },
];

export default function PerformancesSection() {
    const { sections } = useAdminSections();

    const perfSection = sections.find((s) => s.key === 'performances');
    const adminImages = perfSection?.images ?? [];


    return (
        <Box
            id="performances"
            sx={{
                py: { xs: 5, md: 7 },
                position: 'relative',
                bgcolor: '#fdfbf6',
            }}
        >
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
                        Performances
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
                        공연 활동
                    </Typography>
                </Box>

                {/* Performance Cards */}
                <Grid container spacing={3} sx={{ mb: 14 }}>
                    {PERFORMANCES.map((perf, i) => {
                        const img = adminImages[i] ?? null;
                        return (
                            <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                                        },
                                    }}
                                >
                                    {/* Image */}
                                    <Box sx={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                                        {img ? (
                                            <Box
                                                component="img"
                                                src={img.url}
                                                alt={perf.title}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease',
                                                    '&:hover': { transform: 'scale(1.05)' },
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    background: perf.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontFamily: '"Noto Serif KR", serif',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700,
                                                        color: perf.color,
                                                        opacity: 0.2,
                                                        letterSpacing: '0.05em',
                                                    }}
                                                >
                                                    {perf.title.slice(0, 2)}
                                                </Typography>
                                            </Box>
                                        )}
                                        {/* Color accent bar */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                bgcolor: perf.color,
                                                opacity: 0.7,
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ p: 3.5 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: perf.color, mb: 1.5, fontWeight: 700, fontSize: '1rem' }}
                                        >
                                            {perf.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.8, fontSize: '0.85rem' }}
                                        >
                                            {perf.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}
