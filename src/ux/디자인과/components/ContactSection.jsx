import { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    TextField,
    MenuItem,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAdminInquiries } from '../../../system/hooks/useAdminData';
import { sanitizeInquiryForm } from '../../../system/security/sanitize';

const INQUIRY_TYPES = [
    '공연 문의',
    '단원모집',
    '자격증 문의',
    '협업제안',
    '교육프로그램 문의',
    '기타',
];

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        color: 'inherit',
        fontSize: '0.88rem',
        '& fieldset': {
            borderColor: 'rgba(49,70,107,0.12)',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(150,0,0,0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#960000',
            borderWidth: '1.5px',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(49,70,107,0.5)',
        fontSize: '0.85rem',
        '&.Mui-focused': {
            color: '#960000',
        },
    },
    '& .MuiSelect-icon': {
        color: 'rgba(49,70,107,0.4)',
    },
};

const VALIDATORS = {
    name: (v) => v.trim().length < 2 ? '성함을 2자 이상 입력해주세요.' : '',
    email: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '올바른 이메일 형식을 입력해주세요.' : '',
    phone: (v) => v && !/^[\d\s\-+()]{7,}$/.test(v) ? '올바른 연락처 형식을 입력해주세요.' : '',
    type: (v) => !v ? '문의 유형을 선택해주세요.' : '',
    message: (v) => v.trim().length < 10 ? '문의 내용을 10자 이상 입력해주세요.' : '',
};

export default function ContactSection() {
    const { addInquiry } = useAdminInquiries();
    const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const validate = (fields) => {
        const errs = {};
        Object.entries(VALIDATORS).forEach(([key, fn]) => {
            const msg = fn(fields[key] ?? '');
            if (msg) errs[key] = msg;
        });
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = { ...form, [name]: value };
        setForm(next);
        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](value) }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](form[name] ?? '') }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allTouched = Object.fromEntries(Object.keys(VALIDATORS).map((k) => [k, true]));
        setTouched(allTouched);
        const errs = validate(form);
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;

        setSubmitting(true);
        // XSS 방어: DB 저장 전 전체 필드 sanitize
        const sanitized = sanitizeInquiryForm(form);
        addInquiry(sanitized)
            .then(() => {
                setSnackOpen(true);
                setForm({ name: '', email: '', phone: '', type: '', message: '' });
                setErrors({});
                setTouched({});
            })
            .catch(() => {
                // 내부 에러를 사용자에게 노출하지 않음
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Box
            id="contact"
            sx={{
                py: { xs: 13, md: 7 },
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
                            color: '#31466b',
                            textTransform: 'uppercase',
                            mb: 1.5,
                        }}
                    >
                        Contact
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, color: 'text.primary', mb: 2 }}
                    >
                        연락처
                    </Typography>
                    <Box
                        sx={{
                            width: '40px',
                            height: '1.5px',
                            background: 'linear-gradient(90deg, #31466b, #960000)',
                            mx: 'auto',
                        }}
                    />
                </Box>

                <Grid container spacing={{ xs: 6, md: 8 }}>
                    {/* Left: Contact info */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography
                            sx={{
                                fontFamily: '"Noto Serif KR", serif',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 1,
                            }}
                        >
                            사단법인 아트컴퍼니 아르-선
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                opacity: 0.6,
                                letterSpacing: '0.15em',
                                mb: 5,
                            }}
                        >
                            Art Company ART-SUN
                        </Typography>

                        {/* Info items */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(150,0,0,0.05)',
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                    }}
                                >
                                    <EmailIcon sx={{ fontSize: 18, color: '#960000' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.3, letterSpacing: '0.1em' }}>
                                        이메일
                                    </Typography>
                                    <Typography
                                        component="a"
                                        href="mailto:dancersunhee@hanmail.net"
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            '&:hover': { color: '#960000' },
                                            transition: 'color 0.3s',
                                        }}
                                    >
                                        dancersunhee@hanmail.net
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(49,70,107,0.05)',
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                    }}
                                >
                                    <PhoneIcon sx={{ fontSize: 18, color: '#31466b' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.3, letterSpacing: '0.1em' }}>
                                        전화번호
                                    </Typography>
                                    <Typography
                                        component="a"
                                        href="tel:010-2949-2247"
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            '&:hover': { color: '#31466b' },
                                            transition: 'color 0.3s',
                                        }}
                                    >
                                        010-2949-2247
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(83,59,114,0.05)',
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 18, color: '#533b72' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.3, letterSpacing: '0.1em' }}>
                                        상담시간
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'text.primary',
                                        }}
                                    >
                                        평일 10:00 - 18:00
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right: Contact Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                p: { xs: 3, md: 4 },
                                border: '1px solid rgba(49,70,107,0.08)',
                                borderRadius: '2px',
                                bgcolor: '#ffffff',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                            }}
                        >
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="성함"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.name}
                                        helperText={errors.name || ''}
                                        size="small"
                                        sx={textFieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="이메일"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.email}
                                        helperText={errors.email || ''}
                                        size="small"
                                        sx={textFieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="연락처"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.phone}
                                        helperText={errors.phone || ''}
                                        size="small"
                                        sx={textFieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="문의 유형"
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.type}
                                        helperText={errors.type || ''}
                                        size="small"
                                        sx={textFieldSx}
                                    >
                                        {INQUIRY_TYPES.map((t) => (
                                            <MenuItem
                                                key={t}
                                                value={t}
                                                sx={{
                                                    fontSize: '0.85rem',
                                                    '&:hover': { bgcolor: 'rgba(150,0,0,0.08)' },
                                                }}
                                            >
                                                {t}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="문의내용"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.message}
                                        helperText={errors.message || ' '}
                                        multiline
                                        rows={5}
                                        sx={textFieldSx}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        fullWidth
                                        disabled={submitting}
                                        sx={{
                                            borderColor: submitting ? 'rgba(150,0,0,0.3)' : '#960000',
                                            color: '#960000',
                                            fontSize: '0.9rem',
                                            py: 1.3,
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                borderColor: '#c43030',
                                                bgcolor: 'rgba(150,0,0,0.08)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'rgba(240,236,228,0.3)',
                                                borderColor: 'rgba(150,0,0,0.2)',
                                            },
                                        }}
                                    >
                                        {submitting ? '접수 중...' : '문의하기'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

            </Container>

            {/* Success snackbar */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={4000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackOpen(false)}
                    severity="success"
                    sx={{
                        bgcolor: 'rgba(150,0,0,0.9)',
                        color: '#f0ece4',
                        '& .MuiAlert-icon': { color: '#f0ece4' },
                    }}
                >
                    문의가 접수되었습니다. 감사합니다!
                </Alert>
            </Snackbar>
        </Box>
    );
}
