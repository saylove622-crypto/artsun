import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../system/hooks/useAuth';
import { isLockedOut, formatRemainingTime } from '../../system/security/rateLimiter';

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        color: '#f0ece4',
        fontSize: '0.9rem',
        bgcolor: 'rgba(255,255,255,0.03)',
        '& fieldset': { borderColor: 'rgba(240,236,228,0.1)', borderWidth: '1px' },
        '&:hover fieldset': { borderColor: 'rgba(150,0,0,0.3)' },
        '&.Mui-focused fieldset': { borderColor: '#960000', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(240,236,228,0.4)',
        fontSize: '0.85rem',
        '&.Mui-focused': { color: '#960000' },
    },
};

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const [shaking, setShaking] = useState(false);

    // 잠금 카운트다운
    const [lockCountdown, setLockCountdown] = useState('');
    useEffect(() => {
        const tick = () => {
            const { locked, remainingMs } = isLockedOut();
            setLockCountdown(locked ? formatRemainingTime(remainingMs) : '');
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    const shake = () => {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        const result = await login(id, pw);
        setSubmitting(false);

        if (result.success) {
            navigate('/admin', { replace: true });
        } else {
            shake();
            setSnack({ open: true, message: result.error || '로그인에 실패했습니다.' });
        }
    };

    const isBlocked = !!lockCountdown;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#0a0a0f',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decorative blobs */}
            <Box sx={{
                position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,0,0,0.06) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute', bottom: '15%', right: '15%', width: 250, height: 250,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,70,107,0.06) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                autoComplete="on"
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    mx: 2,
                    p: { xs: 4, md: 5 },
                    border: '1px solid rgba(240,236,228,0.06)',
                    borderRadius: '4px',
                    backdropFilter: 'blur(20px)',
                    bgcolor: 'rgba(18,18,26,0.8)',
                    transition: 'transform 0.3s ease',
                    animation: shaking ? 'shake 0.5s ease' : 'none',
                    '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '20%': { transform: 'translateX(-8px)' },
                        '40%': { transform: 'translateX(8px)' },
                        '60%': { transform: 'translateX(-4px)' },
                        '80%': { transform: 'translateX(4px)' },
                    },
                }}
            >
                {/* Lock icon */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: '1.5px solid rgba(150,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 2.5,
                        background: 'linear-gradient(135deg, rgba(150,0,0,0.1) 0%, rgba(49,70,107,0.08) 100%)',
                    }}>
                        <LockOutlinedIcon sx={{ fontSize: 24, color: '#960000' }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontSize: '1.4rem', color: '#f0ece4', mb: 0.5 }}>
                        관리자 로그인
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.3)', letterSpacing: '0.1em' }}>
                        ART-SUN Administration
                    </Typography>
                </Box>

                {/* 잠금 경고 배너 */}
                {isBlocked && (
                    <Box sx={{
                        mb: 2.5, p: 1.5, borderRadius: '3px',
                        bgcolor: 'rgba(150,0,0,0.15)',
                        border: '1px solid rgba(150,0,0,0.3)',
                        textAlign: 'center',
                    }}>
                        <Typography sx={{ fontSize: '0.82rem', color: '#ff8080' }}>
                            🔒 잠금 상태 — {lockCountdown} 후 해제됩니다
                        </Typography>
                    </Box>
                )}

                {/* ID — autocomplete="username" 으로 브라우저 비밀번호 관리자 지원 */}
                <TextField
                    fullWidth
                    label="이메일 (관리자 계정)"
                    type="email"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    disabled={isBlocked || submitting}
                    size="small"
                    sx={{ ...textFieldSx, mb: 2 }}
                    autoFocus
                    autoComplete="username"
                    inputProps={{ maxLength: 254 }}
                />

                {/* PW */}
                <TextField
                    fullWidth
                    label="비밀번호"
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    disabled={isBlocked || submitting}
                    size="small"
                    sx={{ ...textFieldSx, mb: 3.5 }}
                    autoComplete="current-password"
                    inputProps={{ maxLength: 128 }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPw(!showPw)}
                                        edge="end"
                                        sx={{ color: 'rgba(240,236,228,0.3)' }}
                                        size="small"
                                        aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                                    >
                                        {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    disabled={isBlocked || submitting}
                    sx={{
                        borderColor: '#960000',
                        color: '#f0ece4',
                        fontSize: '0.9rem',
                        py: 1.3,
                        letterSpacing: '0.05em',
                        '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.1)' },
                        '&.Mui-disabled': { borderColor: 'rgba(150,0,0,0.2)', color: 'rgba(240,236,228,0.3)' },
                    }}
                >
                    {submitting
                        ? <CircularProgress size={18} sx={{ color: '#960000' }} />
                        : isBlocked ? '잠금 중...' : '로그인'}
                </Button>

                {/* Back link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography
                        component="a"
                        href="/"
                        sx={{
                            fontSize: '0.75rem',
                            color: 'rgba(240,236,228,0.25)',
                            textDecoration: 'none',
                            letterSpacing: '0.05em',
                            '&:hover': { color: 'rgba(240,236,228,0.5)' },
                            transition: 'color 0.3s',
                        }}
                    >
                        ← 홈으로 돌아가기
                    </Typography>
                </Box>
            </Box>

            {/* Error snackbar — 일반적인 메시지만 표시 */}
            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnack(s => ({ ...s, open: false }))}
                    severity="error"
                    sx={{ bgcolor: 'rgba(150,0,0,0.9)', color: '#f0ece4', '& .MuiAlert-icon': { color: '#f0ece4' } }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
