import { Box, Typography, Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAdminSections } from '../../../system/hooks/useAdminData';

const VALUES = [
    {
        title: '연구 & 창작',
        desc: '전통 예술의 본질을 깊이 연구하고, 현대적 감각으로 재해석한 창작 무대를 만들어갑니다.',
        color: '#960000',
    },
    {
        title: '교육 & 보존',
        desc: '우리 문화의 소중한 유산을 보존하고, 다음 세대에 올바른 가치를 전하는 교육 활동을 이어갑니다.',
        color: '#31466b',
    },
    {
        title: '공연 & 소통',
        desc: '관객과의 진정한 교감을 추구하며, 예술이 삶에 활력을 더하는 무대를 선사합니다.',
        color: '#533b72',
    },
];

export default function AboutSection() {
    const theme = useTheme();
    const { sections } = useAdminSections();
    const aboutSection = sections.find((s) => s.key === 'about');

    // 관리자가 올린 사진 목록 (없으면 빈 배열)
    const adminImages = aboutSection?.images ?? [];
    // 단체 대표 사진: 업로드된 첫 번째 이미지
    const mainPhoto = adminImages[0] ?? null;

    return (
        <Box
            id="about"
            sx={{
                py: { xs: 5, md: 7 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle bg accent */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(150,0,0,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
                    {/* Left: Image area */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                aspectRatio: '4/5',
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: '2px',
                            }}
                        >
                            {mainPhoto ? (
                                /* ✅ 관리자 업로드 사진 */
                                <Box
                                    component="img"
                                    src={mainPhoto.url}
                                    alt={mainPhoto.name || '단체 사진'}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                />
                            ) : (
                                /* Placeholder */
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        background: `
                                            linear-gradient(135deg, 
                                              ${theme.palette.primary.main}1a 0%, 
                                              ${theme.palette.background.paper} 40%, 
                                              ${theme.palette.secondary.main}1a 100%
                                            )
                                        `,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: '"Noto Serif KR", serif',
                                            fontSize: '1.1rem',
                                            color: 'text.secondary',
                                            opacity: 0.3,
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        단체 사진
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: 'text.secondary',
                                            opacity: 0.2,
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        관리자 페이지에서 사진을 업로드하세요
                                    </Typography>
                                </Box>
                            )}

                            {/* Corner accents */}
                            <Box sx={{ position: 'absolute', top: -1, left: -1, width: 30, height: 30, borderTop: '1.5px solid #960000', borderLeft: '1.5px solid #960000' }} />
                            <Box sx={{ position: 'absolute', bottom: -1, right: -1, width: 30, height: 30, borderBottom: '1.5px solid #960000', borderRight: '1.5px solid #960000' }} />
                        </Box>

                        {/* 추가 사진이 있을 경우 작은 갤러리 썸네일 표시 */}
                        {adminImages.length > 1 && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                {adminImages.slice(1, 5).map((img, i) => (
                                    <Box
                                        key={img.id}
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                            border: `1px solid ${theme.palette.divider}`,
                                            opacity: 0.7,
                                            transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 1 },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={img.url}
                                            alt={img.name || `단체사진 ${i + 2}`}
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                ))}
                                {adminImages.length > 5 && (
                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '2px',
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', opacity: 0.4 }}>
                                            +{adminImages.length - 5}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Grid>

                    {/* Right: Text content */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        {/* Section label */}
                        <Typography
                            sx={{
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                letterSpacing: '0.3em',
                                color: '#960000',
                                textTransform: 'uppercase',
                                mb: 0.4,
                            }}
                        >
                            About Us
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.8rem', md: '2.3rem' },
                                color: 'text.primary',
                                mb: 4,
                            }}
                        >
                            단체소개
                        </Typography>

                        {/* Professional body subtitle */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ width: 20, height: '1px', bgcolor: '#960000' }} />
                                전문예술법인
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    opacity: 0.85,
                                    pl: { xs: 0, md: 3.5 },
                                    fontSize: '0.92rem',
                                    lineHeight: 2,
                                    textAlign: 'justify',
                                    wordBreak: 'keep-all'
                                }}
                            >
                                사단법인 아트컴퍼니 아르-선은 2016년 6월7일 설립 후 경기도 지정 전문예술법인단체로 성장하여 우리나라 고유의 전통문화와 타악 퍼포먼스를 접목하여 우리나라만의 전통 가락 예술을 연구하고 교육, 보존, 창작, 공연함으로써 안으로는 우리 민족의 유구한 역사와 찬란한 문화를 계승하고 밖으로는 우리 민족 문화의 우수성과 드높은 기상을 세계 전 인류와 더불어 공유함을 목적으로 합니다.
                                <br /><br />
                                ‘(사)아트컴퍼니 아르-선’은 한국무용과 타악 퍼포먼스, 전통예술에 대한 대중화 공연사업을 활발히 추진중이며 ‘스토리텔링’화된 작품과 전통 크로스오버 공연을 제작하여 남녀노소인 대중들과 예술로써 소통하는 창의적인 활동을 꾸준히 이어가고 있습니다. 아르-선은 다양한 예술-문화 컨텐츠들 중의 하나로써 책임감있게 대중들이 쉽게 접할 수 있도록 흥과 멋과 열정을 모든 작품에 쏟아 부으며 매년 정기공연과 기획공연을 통해서 가까이 다가가도록 노력하고 대중들과 공유하는 예술단체입니다.
                            </Typography>
                        </Box>

                        {/* Values heading */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Box sx={{ width: 20, height: '1px', bgcolor: '#533b72' }} />
                            추구 가치
                        </Typography>

                        {/* 🚉 Subway Line Map Style Values */}
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'flex-start' },
                                gap: { xs: 0, sm: 0 },
                            }}
                        >
                            {/* 연결선 (데스크탑: 가로, 모바일: 세로) */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    // 데스크탑: 가로 선
                                    display: { xs: 'none', sm: 'block' },
                                    top: '11px',
                                    left: '11px',
                                    right: '11px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, ${VALUES[0].color}, ${VALUES[1].color}, ${VALUES[2].color})`,
                                    opacity: 0.35,
                                    zIndex: 0,
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    // 모바일: 세로 선
                                    display: { xs: 'block', sm: 'none' },
                                    top: '11px',
                                    left: '10px',
                                    bottom: '11px',
                                    width: '2px',
                                    background: `linear-gradient(180deg, ${VALUES[0].color}, ${VALUES[1].color}, ${VALUES[2].color})`,
                                    opacity: 0.35,
                                    zIndex: 0,
                                }}
                            />

                            {VALUES.map((v, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        flex: { sm: 1 },
                                        display: 'flex',
                                        flexDirection: { xs: 'row', sm: 'column' },
                                        alignItems: { xs: 'flex-start', sm: 'flex-start' },
                                        gap: { xs: 2, sm: 0 },
                                        py: { xs: 2, sm: 0 },
                                        pr: { sm: i < VALUES.length - 1 ? 3 : 0 },
                                    }}
                                >
                                    {/* 노드(역) 점 */}
                                    <Box
                                        sx={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: `2.5px solid ${v.color}`,
                                            bgcolor: theme.palette.background.default,
                                            flexShrink: 0,
                                            position: 'relative',
                                            zIndex: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: v.color,
                                                transform: 'scale(1.2)',
                                                '& .inner-dot': {
                                                    bgcolor: '#fff',
                                                },
                                            },
                                        }}
                                    >
                                        <Box
                                            className="inner-dot"
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: v.color,
                                                transition: 'background-color 0.3s ease',
                                            }}
                                        />
                                    </Box>

                                    {/* 텍스트 영역 */}
                                    <Box sx={{ mt: { xs: 0, sm: 2 } }}>
                                        <Typography
                                            sx={{
                                                fontFamily: '"Noto Serif KR", serif',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 0.8,
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            {v.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.8,
                                                maxWidth: { sm: '240px' },
                                            }}
                                        >
                                            {v.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
