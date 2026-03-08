import { Box, Typography } from '@mui/material';

export default {
    title: 'Foundation/Typography',
    parameters: {
        layout: 'padded',
    },
};

const VARIANTS = [
    { variant: 'h1', label: 'H1 — Shilla Serif', sample: '아트컴퍼니 아르-선' },
    { variant: 'h2', label: 'H2 — Shilla Serif', sample: '공연활동' },
    { variant: 'h3', label: 'H3 — Shilla Serif', sample: '창작무용' },
    { variant: 'h4', label: 'H4 — Shilla Serif', sample: '전통의 울림' },
    { variant: 'h5', label: 'H5 — Sans', sample: '추구 가치' },
    { variant: 'h6', label: 'H6 — Sans', sample: '연구 & 창작' },
    { variant: 'body1', label: 'Body1', sample: '사단법인 아트컴퍼니 아르-선은 경기도 지정 전문예술법인으로서, 전통 공연 예술의 가치를 현대적으로 재해석합니다.' },
    { variant: 'body2', label: 'Body2', sample: '타악, 무용, 난타 등 다양한 장르를 아우르며 예술을 통한 사회적 소통에 기여합니다.' },
    { variant: 'button', label: 'Button', sample: '문의하기' },
];

export const AllVariants = () => (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 4 }}>
            Typography
        </Typography>
        {VARIANTS.map(({ variant, label, sample }) => (
            <Box key={variant} sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 1, letterSpacing: '0.1em' }}>
                    {label} — <code>variant="{variant}"</code>
                </Typography>
                <Typography variant={variant} sx={{ color: 'text.primary' }}>
                    {sample}
                </Typography>
            </Box>
        ))}
    </Box>
);
