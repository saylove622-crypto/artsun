import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Tooltip,
    Tabs,
    Tab,
    Badge,
    Snackbar,
    Alert,
    Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ImageIcon from '@mui/icons-material/Image';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAuth } from '../../system/hooks/useAuth';
import {
    useAdminSections,
    useAdminInquiries,
    useAdminActivities,
    useAdminSideNotices,
    useAdminSiteSettings,
    useAdminDonors,
} from '../../system/hooks/useAdminData';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getYouTubeThumbnailUrl, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../../system/utils/youtube';
import EventIcon from '@mui/icons-material/Event';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import MapIcon from '@mui/icons-material/Map';
import ArticleIcon from '@mui/icons-material/Article';

import EditIcon from '@mui/icons-material/Edit';

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        color: '#f0ece4',
        fontSize: '0.88rem',
        '& fieldset': { borderColor: 'rgba(240,236,228,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(150,0,0,0.3)' },
        '&.Mui-focused fieldset': { borderColor: '#960000', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(240,236,228,0.4)',
        fontSize: '0.85rem',
        '&.Mui-focused': { color: '#960000' },
    },
};

/* ────────────────────────────
   유튜브 썸네일 미리보기
──────────────────────────── */
function YoutubeThumbnailPreview({ url }) {
    const [thumbError, setThumbError] = useState(false);
    const thumbnailUrl = getYouTubeThumbnailUrl(url, 'hqdefault');

    if (!thumbnailUrl) return null;

    return (
        <Box sx={{ mt: 1.5, borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(240,236,228,0.08)', position: 'relative' }}>
            {!thumbError ? (
                <Box
                    component="img"
                    src={thumbnailUrl}
                    alt="썸네일 미리보기"
                    onError={() => setThumbError(true)}
                    sx={{ width: '100%', display: 'block', objectFit: 'cover' }}
                />
            ) : (
                <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(18,18,26,0.6)' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.3)' }}>썸네일 로드 실패</Typography>
                </Box>
            )}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: 1, py: 0.5, bgcolor: 'rgba(0,0,0,0.6)' }}>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    ✅ 유효한 유튜브 URL
                </Typography>
            </Box>
        </Box>
    );
}

/* ────────────────────────────
   Section Management Tab
──────────────────────────── */
function SectionManagement() {
    const { sections, addImage, removeImage, reorderImages, addVideoUrl, removeVideoUrl, reorderVideoUrls } = useAdminSections();
    const [editSection, setEditSection] = useState(null);
    const [videoInput, setVideoInput] = useState('');
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
    const fileInputRefs = useRef({});

    const showSnack = useCallback((message, severity = 'success') => {
        setSnack({ open: true, message, severity });
    }, []);

    const handleFileUpload = (sectionKey) => (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        let uploadedCount = 0;
        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                showSnack(`${file.name}: 5MB 이하만 가능합니다.`, 'error');
                return false;
            }
            return true;
        });

        validFiles.forEach((file) => {
            addImage(sectionKey, file, file.name);
            uploadedCount++;
        });

        if (uploadedCount > 0) {
            showSnack(`${uploadedCount}개의 이미지가 추가되었습니다.`, 'success');
        }
        e.target.value = '';
    };

    const handleAddVideoUrl = (sectionKey) => {
        if (!videoInput.trim()) return;
        if (!getYouTubeEmbedUrl(videoInput.trim())) {
            showSnack('유효한 유튜브 URL을 입력해주세요.', 'error');
            return;
        }
        addVideoUrl(sectionKey, videoInput.trim());
        setVideoInput('');
        showSnack('영상 URL이 추가되었습니다.', 'success');
    };

    const currentSection = sections.find((s) => s.key === editSection);
    const isValidYoutubeUrl = videoInput.trim() && !!getYouTubeEmbedUrl(videoInput.trim());

    return (
        <Box>
            <Typography
                sx={{
                    fontFamily: '"Noto Serif KR", serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#f0ece4',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <DashboardIcon sx={{ fontSize: 22, color: '#960000' }} />
                섹션 콘텐츠 관리
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.35)', mb: 4 }}>
                각 섹션의 사진 및 유튜브 영상을 관리합니다 · 사진은 순서대로 메인 페이지에 반영됩니다
            </Typography>

            <Grid container spacing={3}>
                {sections.map((section) => {
                    const videoUrls = section.videoUrls ?? [];

                    // ✅ 섹션별 가이드 힌트
                    const SECTION_HINTS = {
                        hero: '📌 등록된 영상이 메인 최상단 배경 비디오 스크롤러로 표시됩니다',
                        about: '📌 첫 번째 사진이 대표 단체 사진으로 사용됩니다',
                        performances: '📌 사진 순서대로 [타악 → 창작무용 → 한국무용 → 장구] 카드에 배정됩니다',
                        gallery: '📌 등록된 영상이 "최근 공연 영상" 영역에 순서대로 표시됩니다',
                    };
                    const hint = SECTION_HINTS[section.key] ?? null;
                    return (
                        <Grid size={{ xs: 12, md: 6 }} key={section.key}>
                            <Card
                                sx={{
                                    bgcolor: 'rgba(18,18,26,0.6)',
                                    border: '1px solid rgba(240,236,228,0.06)',
                                    borderRadius: '4px',
                                    transition: 'border-color 0.3s',
                                    '&:hover': { borderColor: 'rgba(150,0,0,0.2)' },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Section header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                                        <Box>
                                            <Typography sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1rem', fontWeight: 600, color: '#f0ece4' }}>
                                                {section.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.25)', letterSpacing: '0.1em' }}>
                                                {section.key.toUpperCase()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {section.key !== 'gallery' && (
                                                <Chip
                                                    icon={<ImageIcon sx={{ fontSize: '14px !important' }} />}
                                                    label={section.images.length}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(150,0,0,0.1)',
                                                        color: 'rgba(240,236,228,0.5)',
                                                        fontSize: '0.7rem',
                                                        height: 24,
                                                        '& .MuiChip-icon': { color: 'rgba(150,0,0,0.6)' },
                                                    }}
                                                />
                                            )}
                                            {videoUrls.length > 0 && (
                                                <Chip
                                                    icon={<YouTubeIcon sx={{ fontSize: '14px !important' }} />}
                                                    label={videoUrls.length}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(49,70,107,0.1)',
                                                        color: 'rgba(240,236,228,0.5)',
                                                        fontSize: '0.7rem',
                                                        height: 24,
                                                        '& .MuiChip-icon': { color: 'rgba(49,70,107,0.6)' },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    {/* ✅ 섹션 가이드 힌트 */}
                                    {hint && (
                                        <Box sx={{ mb: 2, px: 1.5, py: 1, bgcolor: 'rgba(150,0,0,0.04)', borderRadius: '3px', borderLeft: '2px solid rgba(150,0,0,0.25)' }}>
                                            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.4)', lineHeight: 1.5 }}>
                                                {hint}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* ✅ Image thumbnails with reorder */}
                                    {section.key !== 'gallery' && section.images.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(240,236,228,0.25)', mb: 1, letterSpacing: '0.05em' }}>
                                                사진 ({section.images.length}장) — ↑↓ 버튼으로 순서 변경
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {section.images.map((img, imgIdx) => (
                                                    <Box
                                                        key={img.id}
                                                        sx={{
                                                            position: 'relative',
                                                            width: 64,
                                                            height: 64,
                                                            borderRadius: '3px',
                                                            overflow: 'visible',
                                                            border: imgIdx === 0
                                                                ? '1.5px solid rgba(150,0,0,0.5)'
                                                                : '1px solid rgba(240,236,228,0.08)',
                                                        }}
                                                    >
                                                        <Box sx={{ width: '100%', height: '100%', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </Box>
                                                        {/* 첫 번째 이미지 배지 */}
                                                        {imgIdx === 0 && (
                                                            <Box sx={{ position: 'absolute', top: -8, left: -1, bgcolor: '#960000', borderRadius: '2px', px: 0.5 }}>
                                                                <Typography sx={{ fontSize: '0.5rem', color: '#fff', lineHeight: 1.6, letterSpacing: '0.03em' }}>대표</Typography>
                                                            </Box>
                                                        )}
                                                        {/* 순서 변경 버튼 */}
                                                        <Box sx={{ position: 'absolute', top: -1, right: -18, display: 'flex', flexDirection: 'column', gap: 0 }}>
                                                            <IconButton
                                                                size="small"
                                                                disabled={imgIdx === 0}
                                                                onClick={() => reorderImages(section.key, imgIdx, imgIdx - 1)}
                                                                sx={{ p: 0, color: imgIdx === 0 ? 'rgba(240,236,228,0.08)' : 'rgba(240,236,228,0.35)', '&:hover': { color: '#960000' }, width: 16, height: 16 }}
                                                            >
                                                                <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                disabled={imgIdx === section.images.length - 1}
                                                                onClick={() => reorderImages(section.key, imgIdx, imgIdx + 1)}
                                                                sx={{ p: 0, color: imgIdx === section.images.length - 1 ? 'rgba(240,236,228,0.08)' : 'rgba(240,236,228,0.35)', '&:hover': { color: '#960000' }, width: 16, height: 16 }}
                                                            >
                                                                <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                        </Box>
                                                        {/* 삭제 오버레이 */}
                                                        <Box
                                                            className="delete-overlay"
                                                            onClick={() => removeImage(section.key, img.id)}
                                                            sx={{
                                                                position: 'absolute',
                                                                inset: 0,
                                                                bgcolor: 'rgba(150,0,0,0.7)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                opacity: 0,
                                                                transition: 'opacity 0.2s',
                                                                cursor: 'pointer',
                                                                borderRadius: '3px',
                                                                '&:hover': { opacity: 1 },
                                                            }}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 18, color: '#fff' }} />
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* ✅ Video URLs with thumbnails */}
                                    {videoUrls.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(240,236,228,0.25)', mb: 1, letterSpacing: '0.05em' }}>
                                                등록된 영상 ({videoUrls.length}개)
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {videoUrls.map((url, urlIdx) => {
                                                    const thumbUrl = getYouTubeThumbnailUrl(url, 'default');
                                                    return (
                                                        <Box
                                                            key={urlIdx}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                p: 1,
                                                                bgcolor: 'rgba(10,10,15,0.4)',
                                                                border: '1px solid rgba(240,236,228,0.05)',
                                                                borderRadius: '3px',
                                                            }}
                                                        >
                                                            {/* 썸네일 */}
                                                            <Box sx={{ width: 48, height: 36, borderRadius: '2px', overflow: 'hidden', flexShrink: 0, bgcolor: 'rgba(18,18,26,0.5)' }}>
                                                                {thumbUrl && (
                                                                    <img src={thumbUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                )}
                                                            </Box>
                                                            {/* URL 텍스트 */}
                                                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.4)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {url}
                                                            </Typography>
                                                            {/* 순서/삭제 버튼 */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={urlIdx === 0}
                                                                    onClick={() => reorderVideoUrls(section.key, urlIdx, urlIdx - 1)}
                                                                    sx={{ p: 0.3, color: 'rgba(240,236,228,0.3)', '&:hover': { color: '#533b72' } }}
                                                                >
                                                                    <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={urlIdx === videoUrls.length - 1}
                                                                    onClick={() => reorderVideoUrls(section.key, urlIdx, urlIdx + 1)}
                                                                    sx={{ p: 0.3, color: 'rgba(240,236,228,0.3)', '&:hover': { color: '#533b72' } }}
                                                                >
                                                                    <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                                                                </IconButton>
                                                                <Tooltip title="유튜브에서 열기">
                                                                    <IconButton
                                                                        size="small"
                                                                        href={getYouTubeWatchUrl(url)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        component="a"
                                                                        sx={{ p: 0.3, color: 'rgba(240,236,228,0.3)', '&:hover': { color: '#31466b' } }}
                                                                    >
                                                                        <OpenInNewIcon sx={{ fontSize: 13 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="삭제">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => removeVideoUrl(section.key, urlIdx)}
                                                                        sx={{ p: 0.3, color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' } }}
                                                                    >
                                                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Action buttons */}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            ref={(el) => (fileInputRefs.current[section.key] = el)}
                                            style={{ display: 'none' }}
                                            onChange={handleFileUpload(section.key)}
                                            id={`upload-${section.key}`}
                                        />
                                        {section.key !== 'gallery' && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<PhotoCameraIcon sx={{ fontSize: '16px !important' }} />}
                                                onClick={() => fileInputRefs.current[section.key]?.click()}
                                                sx={{
                                                    borderColor: 'rgba(150,0,0,0.3)',
                                                    color: 'rgba(240,236,228,0.6)',
                                                    fontSize: '0.75rem',
                                                    '&:hover': { borderColor: '#960000', bgcolor: 'rgba(150,0,0,0.08)' },
                                                }}
                                            >
                                                사진 추가
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<VideocamIcon sx={{ fontSize: '16px !important' }} />}
                                            onClick={() => {
                                                setEditSection(section.key);
                                                setVideoInput('');
                                            }}
                                            sx={{
                                                borderColor: 'rgba(49,70,107,0.3)',
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                '&:hover': { borderColor: '#31466b', bgcolor: 'rgba(49,70,107,0.08)' },
                                            }}
                                        >
                                            영상 추가
                                        </Button>
                                    </Box>

                                    {/* Special Video List for Performances */}
                                    {section.key === 'performances' && <PerformanceVideoManagement />}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ✅ Video URL 추가 Dialog */}
            <Dialog
                open={!!editSection}
                onClose={() => setEditSection(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#12121a',
                        border: '1px solid rgba(240,236,228,0.08)',
                        borderRadius: '4px',
                    },
                }}
            >
                <DialogTitle sx={{ color: '#f0ece4', fontSize: '1rem', fontFamily: '"Noto Serif KR", serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <YouTubeIcon sx={{ fontSize: 18, color: '#960000' }} />
                            {currentSection?.label} — 영상 URL 추가
                        </Box>
                        <IconButton onClick={() => setEditSection(null)} sx={{ color: 'rgba(240,236,228,0.3)' }} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {/* 등록된 영상 목록 */}
                    {currentSection?.videoUrls?.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)', mb: 1 }}>
                                등록된 영상 ({currentSection.videoUrls.length}개)
                            </Typography>
                            {currentSection.videoUrls.map((url, idx) => {
                                const thumbUrl = getYouTubeThumbnailUrl(url, 'default');
                                return (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8, p: 0.8, bgcolor: 'rgba(10,10,15,0.5)', borderRadius: '3px', border: '1px solid rgba(240,236,228,0.05)' }}>
                                        {thumbUrl && (
                                            <Box sx={{ width: 48, height: 36, borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={thumbUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </Box>
                                        )}
                                        <Typography sx={{ flex: 1, fontSize: '0.7rem', color: 'rgba(240,236,228,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {url}
                                        </Typography>
                                        <IconButton size="small" onClick={() => removeVideoUrl(editSection, idx)} sx={{ color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' }, p: 0.3 }}>
                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                );
                            })}
                            <Divider sx={{ my: 2, borderColor: 'rgba(240,236,228,0.06)' }} />
                        </Box>
                    )}

                    {/* URL 입력 */}
                    <TextField
                        fullWidth
                        label="YouTube URL 입력"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoInput}
                        onChange={(e) => setVideoInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && isValidYoutubeUrl) {
                                handleAddVideoUrl(editSection);
                            }
                        }}
                        size="small"
                        sx={{ ...textFieldSx, mt: 1 }}
                    />
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.25)', mt: 0.8 }}>
                        예: https://www.youtube.com/watch?v=dQw4w9WgXcQ · Enter 키로 빠르게 추가
                    </Typography>

                    {/* ✅ 썸네일 미리보기 */}
                    {videoInput.trim() && (
                        isValidYoutubeUrl ? (
                            <YoutubeThumbnailPreview url={videoInput.trim()} />
                        ) : (
                            <Box sx={{ mt: 1.5, p: 1, bgcolor: 'rgba(150,0,0,0.08)', borderRadius: '3px', border: '1px solid rgba(150,0,0,0.2)' }}>
                                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(150,0,0,0.8)' }}>
                                    ⚠️ 유효하지 않은 유튜브 URL입니다
                                </Typography>
                            </Box>
                        )
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setEditSection(null)}
                        sx={{ color: 'rgba(240,236,228,0.4)', fontSize: '0.8rem' }}
                    >
                        닫기
                    </Button>
                    <Button
                        onClick={() => handleAddVideoUrl(editSection)}
                        disabled={!isValidYoutubeUrl}
                        variant="outlined"
                        startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
                        sx={{
                            borderColor: isValidYoutubeUrl ? '#960000' : 'rgba(240,236,228,0.1)',
                            color: isValidYoutubeUrl ? '#f0ece4' : 'rgba(240,236,228,0.3)',
                            fontSize: '0.8rem',
                            '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.08)' },
                        }}
                    >
                        추가
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnack({ ...snack, open: false })}
                    severity={snack.severity}
                    sx={{
                        bgcolor: snack.severity === 'success' ? 'rgba(0,100,0,0.9)' : snack.severity === 'error' ? 'rgba(150,0,0,0.9)' : 'rgba(49,70,107,0.9)',
                        color: '#f0ece4',
                        '& .MuiAlert-icon': { color: '#f0ece4' },
                    }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

/* ────────────────────────────
   Inquiry Management Tab
──────────────────────────── */
function InquiryManagement() {
    const { inquiries, markAsRead, deleteInquiry } = useAdminInquiries();
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    return (
        <Box>
            <Typography
                sx={{
                    fontFamily: '"Noto Serif KR", serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#f0ece4',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <MailIcon sx={{ fontSize: 22, color: '#31466b' }} />
                문의 관리
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.35)', mb: 4 }}>
                고객 문의를 확인하고 관리합니다 · 총 {inquiries.length}건
            </Typography>

            {inquiries.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        border: '1px solid rgba(240,236,228,0.04)',
                        borderRadius: '4px',
                    }}
                >
                    <MailIcon sx={{ fontSize: 48, color: 'rgba(240,236,228,0.08)', mb: 2 }} />
                    <Typography sx={{ fontSize: '0.9rem', color: 'rgba(240,236,228,0.25)' }}>
                        접수된 문의가 없습니다
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.15)', mt: 0.5 }}>
                        홈페이지 문의 양식을 통해 접수된 문의가 여기에 표시됩니다
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {inquiries.map((inq) => (
                        <Card
                            key={inq.id}
                            onClick={() => {
                                setSelectedInquiry(inq);
                                if (!inq.isRead) markAsRead(inq.id);
                            }}
                            sx={{
                                bgcolor: inq.isRead ? 'rgba(18,18,26,0.4)' : 'rgba(18,18,26,0.7)',
                                border: `1px solid ${inq.isRead ? 'rgba(240,236,228,0.04)' : 'rgba(150,0,0,0.15)'}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': { borderColor: 'rgba(150,0,0,0.3)', transform: 'translateY(-1px)' },
                            }}
                        >
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            {!inq.isRead && (
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#960000', flexShrink: 0 }} />
                                            )}
                                            <Typography sx={{ fontSize: '0.9rem', color: '#f0ece4', fontWeight: inq.isRead ? 400 : 600 }}>
                                                {inq.name}
                                            </Typography>
                                            <Chip label={inq.type} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: 'rgba(83,59,114,0.15)', color: 'rgba(240,236,228,0.5)' }} />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
                                            {inq.message}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 2 }}>
                                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(240,236,228,0.2)' }}>
                                            {new Date(inq.createdAt).toLocaleDateString('ko-KR')}
                                        </Typography>
                                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="삭제">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteInquiry(inq.id);
                                                    }}
                                                    sx={{ color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' } }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Inquiry Detail Dialog */}
            <Dialog
                open={!!selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#12121a',
                        border: '1px solid rgba(240,236,228,0.08)',
                        borderRadius: '4px',
                    },
                }}
            >
                {selectedInquiry && (
                    <>
                        <DialogTitle sx={{ color: '#f0ece4', fontSize: '1rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MarkEmailReadIcon sx={{ fontSize: 20, color: '#31466b' }} />
                                    문의 상세
                                </Box>
                                <IconButton onClick={() => setSelectedInquiry(null)} sx={{ color: 'rgba(240,236,228,0.3)' }} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers sx={{ borderColor: 'rgba(240,236,228,0.06)' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)', mb: 0.3 }}>이름</Typography>
                                    <Typography sx={{ fontSize: '0.9rem', color: '#f0ece4' }}>{selectedInquiry.name}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)', mb: 0.3 }}>연락처</Typography>
                                    <Typography sx={{ fontSize: '0.9rem', color: '#f0ece4' }}>{selectedInquiry.email} / {selectedInquiry.phone || '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)', mb: 0.3 }}>유형</Typography>
                                    <Chip label={selectedInquiry.type} size="small" sx={{ fontSize: '0.75rem', bgcolor: 'rgba(83,59,114,0.15)', color: 'rgba(240,236,228,0.5)' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)', mb: 0.3 }}>문의 내용</Typography>
                                    <Typography sx={{ fontSize: '0.9rem', color: 'rgba(240,236,228,0.8)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                        {selectedInquiry.message}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.65rem', color: 'rgba(240,236,228,0.2)' }}>
                                        접수일: {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}

/* ────────────────────────────
   Admin Dashboard Page
──────────────────────────── */
export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { unreadCount } = useAdminInquiries();
    const [tab, setTab] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Top bar */}
            <Box
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(20px)',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Shilla", "Noto Serif KR", serif',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '4px',
                                        background: 'linear-gradient(135deg, #960000 0%, #6a0000 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DashboardIcon sx={{ fontSize: 16, color: '#fff' }} />
                                </Box>
                                ART-SUN Admin
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                size="small"
                                startIcon={<HomeIcon fontSize="small" />}
                                onClick={() => navigate('/')}
                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                                홈페이지
                            </Button>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
                            <IconButton onClick={handleLogout} sx={{ color: 'text.secondary', '&:hover': { color: '#960000' } }}>
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, newValue) => setTab(newValue)}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                letterSpacing: '0.02em',
                                minWidth: 100,
                                py: 2,
                            },
                        }}
                    >
                        <Tab icon={<DashboardIcon sx={{ fontSize: 18 }} />} label="섹션 관리" iconPosition="start" />
                        <Tab icon={<EventIcon sx={{ fontSize: 18 }} />} label="활동 내역" iconPosition="start" />
                        <Tab icon={<GroupAddIcon sx={{ fontSize: 18 }} />} label="모집/자격증" iconPosition="start" />
                        <Tab icon={<VolunteerActivismIcon sx={{ fontSize: 18 }} />} label="후원 관리" iconPosition="start" />
                        <Tab
                            icon={
                                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                                    <MailIcon sx={{ fontSize: 18 }} />
                                </Badge>
                            }
                            label="문의 내역"
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                <Box sx={{ minHeight: 400 }}>
                    {tab === 0 && <SectionManagement />}
                    {tab === 1 && <ActivityManagement />}
                    {tab === 2 && <RecruitmentManagement />}
                    {tab === 3 && <DonationManagement />}
                    {tab === 4 && <InquiryManagement />}
                </Box>
            </Container>
        </Box>
    );
}

/* ────────────────────────────
   Activity Management Tab
──────────────────────────── */
function ActivityManagement() {
    const { activities, addActivity, updateActivity, deleteActivity } = useAdminActivities();
    const { notices, addNotice, deleteNotice } = useAdminSideNotices();
    const [editActivity, setEditActivity] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [newNotice, setNewNotice] = useState('');
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        title: '',
        organizer: '',
        sponsor: '',
        event_date: '',
        location: '',
        runtime: '',
        poster_url: ''
    });

    const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

    const handleSaveNotice = async () => {
        if (!newNotice.trim()) return;
        const { error } = await addNotice(newNotice);
        if (!error) { setNewNotice(''); showSnack('공지사항이 등록되었습니다.'); }
        else showSnack('공지사항 등록에 실패했습니다.', 'error');
    };

    const handleOpenDialog = (activity = null) => {
        if (activity) {
            setEditActivity(activity);
            setFormData({ ...activity, event_date: activity.event_date?.split('T')[0] || '' });
            setPosterPreview(activity.poster_url || null);
        } else {
            setEditActivity(null);
            setFormData({ title: '', organizer: '', sponsor: '', event_date: '', location: '', runtime: '', poster_url: '' });
            setPosterPreview(null);
        }
        setPosterFile(null);
        setIsDialogOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPosterFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPosterPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) { showSnack('행사명을 입력해주세요.', 'error'); return; }
        // Postgres DATE 타입에 빈 문자열은 사용 불가 → null 변환
        const sanitized = {
            title: formData.title.trim(),
            organizer: formData.organizer?.trim() || null,
            sponsor: formData.sponsor?.trim() || null,
            event_date: formData.event_date || null,
            location: formData.location?.trim() || null,
            runtime: formData.runtime?.trim() || null,
            poster_url: formData.poster_url || null,
        };
        const { error } = editActivity
            ? await updateActivity(editActivity.id, sanitized, posterFile)
            : await addActivity(sanitized, posterFile);
        if (!error) {
            showSnack(editActivity ? '활동이 수정되었습니다.' : '새 활동이 등록되었습니다.');
            setIsDialogOpen(false);
        } else {
            console.error('Activity save error:', error);
            showSnack(`저장 오류: ${error.message || '알 수 없는 오류'}`, 'error');
        }

    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography sx={{
                        fontFamily: '"Noto Serif KR", serif', fontSize: '1.3rem', fontWeight: 600,
                        color: '#f0ece4', mb: 1, display: 'flex', alignItems: 'center', gap: 1.5,
                    }}>
                        <EventIcon sx={{ fontSize: 22, color: '#960000' }} />
                        활동 내역 관리
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.35)' }}>
                        공연·행사 내역을 등록하고 수정합니다 · 총 {activities.length}건 등록됨
                    </Typography>
                </Box>
                <Button
                    variant="contained" startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#960000', '&:hover': { bgcolor: '#7a0000' }, fontSize: '0.82rem', borderRadius: '3px' }}
                >
                    활동 추가
                </Button>
            </Box>

            {/* Activity Cards */}
            {activities.length === 0 ? (
                <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed rgba(240,236,228,0.1)', borderRadius: '4px' }}>
                    <EventIcon sx={{ fontSize: 48, color: 'rgba(240,236,228,0.1)', mb: 2 }} />
                    <Typography sx={{ color: 'rgba(240,236,228,0.3)', fontSize: '0.9rem' }}>등록된 활동 내역이 없습니다</Typography>
                    <Typography sx={{ color: 'rgba(240,236,228,0.18)', fontSize: '0.75rem', mt: 0.5 }}>위 '활동 추가' 버튼으로 첫 번째 활동을 등록하세요</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {activities.map((act) => (
                        <Grid size={{ xs: 12, md: 6 }} key={act.id}>
                            <Card sx={{
                                display: 'flex', minHeight: 120,
                                bgcolor: 'rgba(18,18,26,0.6)',
                                border: '1px solid rgba(240,236,228,0.07)',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s',
                                '&:hover': { borderColor: 'rgba(150,0,0,0.25)' },
                            }}>
                                {act.poster_url ? (
                                    <Box sx={{ width: 90, flexShrink: 0, overflow: 'hidden' }}>
                                        <img src={act.poster_url} alt="poster" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    </Box>
                                ) : (
                                    <Box sx={{ width: 90, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(150,0,0,0.05)' }}>
                                        <ArticleIcon sx={{ fontSize: 28, color: 'rgba(150,0,0,0.3)' }} />
                                    </Box>
                                )}
                                <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#f0ece4', mb: 0.5, lineHeight: 1.4 }}>{act.title}</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                            {act.event_date && (
                                                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(240,236,228,0.45)' }}>
                                                    📅 {act.event_date} {act.location && `· 📍 ${act.location}`}
                                                </Typography>
                                            )}
                                            {act.organizer && (
                                                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(240,236,228,0.3)' }}>주최: {act.organizer}</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                                        <Tooltip title="수정">
                                            <IconButton size="small" onClick={() => handleOpenDialog(act)} sx={{ color: 'rgba(240,236,228,0.35)', '&:hover': { color: '#31466b' } }}>
                                                <EditIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="삭제">
                                            <IconButton size="small" onClick={() => deleteActivity(act.id)} sx={{ color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' } }}>
                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Side Notices Management */}
            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(240,236,228,0.07)' }}>
                <Typography sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1rem', fontWeight: 600, color: '#f0ece4', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArticleIcon sx={{ fontSize: 18, color: '#31466b' }} />
                    공지사항 관리
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.3)', mb: 3 }}>활동 내역 페이지 우측 공지 패널에 표시됩니다</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ p: 2.5, bgcolor: 'rgba(49,70,107,0.1)', border: '1px solid rgba(49,70,107,0.2)', borderRadius: '4px' }}>
                            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(240,236,228,0.5)', mb: 1.5, fontWeight: 600 }}>새 공지 추가</Typography>
                            <TextField
                                multiline rows={3} fullWidth
                                value={newNotice}
                                onChange={e => setNewNotice(e.target.value)}
                                placeholder="공지 내용을 입력하세요"
                                size="small"
                                sx={{
                                    ...textFieldSx,
                                    mb: 1.5,
                                    // 공지 입력 필드는 밝은 배경이라 텍스트를 어둡게 처리
                                    '& .MuiOutlinedInput-root': {
                                        color: '#1a1a1a',
                                        fontSize: '0.88rem',
                                        bgcolor: '#ffffff',
                                        '& fieldset': { borderColor: 'rgba(49,70,107,0.25)' },
                                        '&:hover fieldset': { borderColor: 'rgba(150,0,0,0.4)' },
                                        '&.Mui-focused fieldset': { borderColor: '#960000', borderWidth: '1.5px' },
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'rgba(0,0,0,0.35)',
                                        opacity: 1,
                                    },
                                }}
                            />
                            <Button
                                variant="outlined" fullWidth size="small"
                                onClick={handleSaveNotice}
                                disabled={!newNotice.trim()}
                                sx={{ borderColor: 'rgba(49,70,107,0.5)', color: 'rgba(240,236,228,0.6)', fontSize: '0.78rem', '&:hover': { borderColor: '#31466b', bgcolor: 'rgba(49,70,107,0.1)' } }}
                            >
                                공지 등록
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {notices.length === 0 && (
                                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.2)', py: 3, textAlign: 'center' }}>등록된 공지사항이 없습니다.</Typography>
                            )}
                            {notices.map(note => (
                                <Box key={note.id} sx={{
                                    p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                    bgcolor: 'rgba(18,18,26,0.5)', border: '1px solid rgba(240,236,228,0.05)', borderRadius: '3px',
                                }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: 'rgba(240,236,228,0.65)', lineHeight: 1.6, flex: 1, mr: 1 }}>{note.content}</Typography>
                                    <IconButton size="small" onClick={() => deleteNotice(note.id)} sx={{ color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' }, flexShrink: 0, p: 0.3 }}>
                                        <DeleteIcon sx={{ fontSize: 15 }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Activity Add/Edit Dialog */}
            <Dialog
                open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#12121a', border: '1px solid rgba(240,236,228,0.08)', borderRadius: '4px' } }}
            >
                <DialogTitle sx={{ color: '#f0ece4', fontSize: '1rem', fontFamily: '"Noto Serif KR", serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 18, color: '#960000' }} />
                            {editActivity ? '활동 수정' : '새 활동 추가'}
                        </Box>
                        <IconButton onClick={() => setIsDialogOpen(false)} sx={{ color: 'rgba(240,236,228,0.3)' }} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="행사명 *" fullWidth size="small" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} sx={textFieldSx} />
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="주최/주관" fullWidth size="small" value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} sx={textFieldSx} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="후원" fullWidth size="small" value={formData.sponsor} onChange={e => setFormData({ ...formData, sponsor: e.target.value })} sx={textFieldSx} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="일시" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} sx={textFieldSx} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="런닝타임" fullWidth size="small" placeholder="예: 70분" value={formData.runtime} onChange={e => setFormData({ ...formData, runtime: e.target.value })} sx={textFieldSx} />
                            </Grid>
                        </Grid>
                        <TextField label="장소" fullWidth size="small" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} sx={textFieldSx} />

                        {/* Poster Upload */}
                        <Box>
                            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(240,236,228,0.35)', mb: 1 }}>포스터 이미지</Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                {posterPreview && (
                                    <Box sx={{ width: 80, height: 110, borderRadius: '3px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(240,236,228,0.1)' }}>
                                        <img src={posterPreview} alt="포스터 미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                )}
                                <Box sx={{ flex: 1 }}>
                                    <Button
                                        variant="outlined" component="label" size="small" startIcon={<PhotoCameraIcon sx={{ fontSize: '15px !important' }} />}
                                        sx={{ borderColor: 'rgba(240,236,228,0.15)', color: 'rgba(240,236,228,0.5)', fontSize: '0.75rem', mb: 0.5, '&:hover': { borderColor: '#960000', bgcolor: 'rgba(150,0,0,0.05)' } }}
                                    >
                                        {posterPreview ? '포스터 변경' : '포스터 선택'}
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>
                                    <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.2)' }}>{posterFile ? posterFile.name : (formData.poster_url ? '기존 이미지 있음' : '5MB 이하 권장')}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ color: 'rgba(240,236,228,0.4)', fontSize: '0.8rem' }}>취소</Button>
                    <Button
                        onClick={handleSave} variant="outlined"
                        disabled={!formData.title.trim()}
                        sx={{ borderColor: '#960000', color: '#f0ece4', fontSize: '0.8rem', '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.08)' } }}
                    >
                        {editActivity ? '수정 완료' : '등록'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ bgcolor: snack.severity === 'success' ? 'rgba(0,100,0,0.9)' : 'rgba(150,0,0,0.9)', color: '#f0ece4', '& .MuiAlert-icon': { color: '#f0ece4' } }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

/* ────────────────────────────
   Recruitment Management Tab
──────────────────────────── */
function RecruitmentManagement() {
    const { settings, updateSetting } = useAdminSiteSettings();
    const [recInfo, setRecInfo] = useState('');
    const [certInfo, setCertInfo] = useState('');

    useEffect(() => {
        if (settings.recruitment) {
            setRecInfo(settings.recruitment.recruitment_info || '');
            setCertInfo(settings.recruitment.certification_info || '');
        }
    }, [settings.recruitment]);

    const handleSave = () => {
        updateSetting('recruitment', { recruitment_info: recInfo, certification_info: certInfo });
    };

    return (
        <Box sx={{ maxWidth: 800 }}>
            <Typography sx={{ fontFamily: '"Shilla", serif', fontSize: '1.3rem', fontWeight: 600, color: 'text.primary', mb: 3 }}>
                단원 모집 및 자격증 과정 관리
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>단원 모집 안내</Typography>
                    <TextField multiline rows={6} fullWidth value={recInfo} onChange={e => setRecInfo(e.target.value)} placeholder="단원 모집 요강을 입력하세요" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>자격증 과정 안내</Typography>
                    <TextField multiline rows={6} fullWidth value={certInfo} onChange={e => setCertInfo(e.target.value)} placeholder="자격증 과정 안내를 입력하세요" />
                </Grid>
            </Grid>
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>설정 저장</Button>
        </Box>
    );
}

/* ────────────────────────────
   Donation Management Tab
──────────────────────────── */
function DonationManagement() {
    const { settings, updateSetting } = useAdminSiteSettings();
    const { donors, loading, addDonor, updateDonor, deleteDonor, toggleVisibility } = useAdminDonors();
    const [accountData, setAccountData] = useState({ bank_name: '', account_number: '', account_holder: '', message: '' });
    const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false);
    const [editDonor, setEditDonor] = useState(null);
    const [donorForm, setDonorForm] = useState({ name: '', donated_at: '', amount: '', message: '', is_visible: true });
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

    const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

    useEffect(() => {
        if (settings.donation) setAccountData(settings.donation);
    }, [settings.donation]);

    const handleAccountSave = async () => {
        const { error } = await updateSetting('donation', accountData);
        showSnack(error ? '저장 실패' : '계좌 정보가 저장되었습니다.', error ? 'error' : 'success');
    };

    const handleOpenDonorDialog = (donor = null) => {
        if (donor) {
            setEditDonor(donor);
            setDonorForm({ name: donor.name, donated_at: donor.donated_at || '', amount: donor.amount || '', message: donor.message || '', is_visible: donor.is_visible });
        } else {
            setEditDonor(null);
            setDonorForm({ name: '', donated_at: '', amount: '', message: '', is_visible: true });
        }
        setIsDonorDialogOpen(true);
    };

    const handleSaveDonor = async () => {
        if (!donorForm.name.trim()) { showSnack('성명을 입력해주세요.', 'error'); return; }
        const payload = {
            name: donorForm.name.trim(),
            donated_at: donorForm.donated_at || null,
            amount: donorForm.amount ? parseInt(donorForm.amount) : null,
            message: donorForm.message.trim() || null,
            is_visible: donorForm.is_visible,
        };
        const { error } = editDonor
            ? await updateDonor(editDonor.id, payload)
            : await addDonor(payload);
        if (!error) { showSnack(editDonor ? '후원자 정보가 수정되었습니다.' : '후원자가 등록되었습니다.'); setIsDonorDialogOpen(false); }
        else showSnack('저장 중 오류가 발생했습니다.', 'error');
    };

    const visibleCount = donors.filter(d => d.is_visible).length;

    return (
        <Box>
            {/* Header */}
            <Typography sx={{
                fontFamily: '"Noto Serif KR", serif', fontSize: '1.3rem', fontWeight: 600,
                color: '#f0ece4', mb: 1, display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
                <VolunteerActivismIcon sx={{ fontSize: 22, color: '#960000' }} />
                후원 관리
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.35)', mb: 5 }}>
                후원 계좌 정보와 후원해주신 분들의 명단을 관리합니다
            </Typography>

            <Grid container spacing={5}>
                {/* Left: Account Info */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(18,18,26,0.6)', border: '1px solid rgba(240,236,228,0.07)', borderRadius: '4px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(240,236,228,0.5)', fontWeight: 700, letterSpacing: '0.1em', mb: 2.5 }}>후원 계좌 정보</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="은행명" fullWidth size="small" value={accountData.bank_name} onChange={e => setAccountData({ ...accountData, bank_name: e.target.value })} sx={textFieldSx} />
                            <TextField label="계좌번호" fullWidth size="small" value={accountData.account_number} onChange={e => setAccountData({ ...accountData, account_number: e.target.value })} sx={textFieldSx} />
                            <TextField label="예금주" fullWidth size="small" value={accountData.account_holder} onChange={e => setAccountData({ ...accountData, account_holder: e.target.value })} sx={textFieldSx} />
                            <TextField label="후원 소개 메시지" multiline rows={3} fullWidth size="small" value={accountData.message} onChange={e => setAccountData({ ...accountData, message: e.target.value })} sx={textFieldSx} />
                            <Button
                                variant="outlined" fullWidth size="small" onClick={handleAccountSave}
                                sx={{ borderColor: '#960000', color: '#f0ece4', fontSize: '0.8rem', '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.08)' } }}
                            >
                                계좌 정보 저장
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Right: Donor List */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(240,236,228,0.5)', fontWeight: 700, letterSpacing: '0.1em' }}>후원자 명단</Typography>
                            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.25)', mt: 0.3 }}>총 {donors.length}명 · 노출 {visibleCount}명</Typography>
                        </Box>
                        <Button
                            size="small" variant="outlined" startIcon={<PersonAddIcon sx={{ fontSize: '15px !important' }} />}
                            onClick={() => handleOpenDonorDialog()}
                            sx={{ borderColor: 'rgba(150,0,0,0.4)', color: 'rgba(240,236,228,0.7)', fontSize: '0.75rem', '&:hover': { borderColor: '#960000', bgcolor: 'rgba(150,0,0,0.07)' } }}
                        >
                            후원자 추가
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={28} sx={{ color: '#960000' }} /></Box>
                    ) : donors.length === 0 ? (
                        <Box sx={{ py: 8, textAlign: 'center', border: '1px dashed rgba(240,236,228,0.08)', borderRadius: '4px' }}>
                            <VolunteerActivismIcon sx={{ fontSize: 40, color: 'rgba(240,236,228,0.1)', mb: 1.5 }} />
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(240,236,228,0.25)' }}>등록된 후원자가 없습니다</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ bgcolor: 'rgba(18,18,26,0.6)', border: '1px solid rgba(240,236,228,0.07)', borderRadius: '4px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ '& th': { borderColor: 'rgba(240,236,228,0.07)', fontSize: '0.68rem', color: 'rgba(240,236,228,0.35)', fontWeight: 600, letterSpacing: '0.08em', py: 1.5 } }}>
                                        <TableCell>성명</TableCell>
                                        <TableCell>후원일</TableCell>
                                        <TableCell>금액</TableCell>
                                        <TableCell align="center">노출</TableCell>
                                        <TableCell align="right">관리</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {donors.map((donor) => (
                                        <TableRow key={donor.id} sx={{
                                            '& td': { borderColor: 'rgba(240,236,228,0.05)', py: 1.2 },
                                            opacity: donor.is_visible ? 1 : 0.45,
                                            '&:hover': { bgcolor: 'rgba(240,236,228,0.02)' },
                                        }}>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.82rem', color: '#f0ece4', fontWeight: 600 }}>{donor.name}</Typography>
                                                {donor.message && <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.35)', mt: 0.2 }}>" {donor.message} "</Typography>}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.45)', whiteSpace: 'nowrap' }}>
                                                {donor.donated_at || '-'}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.78rem', color: 'rgba(240,236,228,0.6)', whiteSpace: 'nowrap' }}>
                                                {donor.amount ? `${donor.amount.toLocaleString()}원` : '-'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={donor.is_visible ? '사이트에 노출 중 (클릭시 숨김)' : '숨김 상태 (클릭시 노출)'}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleVisibility(donor.id, !donor.is_visible)}
                                                        sx={{ p: 0.5, color: donor.is_visible ? 'rgba(150,0,0,0.7)' : 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' } }}
                                                    >
                                                        {donor.is_visible ? <VisibilityIcon sx={{ fontSize: 16 }} /> : <VisibilityOffIcon sx={{ fontSize: 16 }} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="수정">
                                                        <IconButton size="small" onClick={() => handleOpenDonorDialog(donor)} sx={{ p: 0.5, color: 'rgba(240,236,228,0.25)', '&:hover': { color: '#31466b' } }}>
                                                            <EditIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="삭제">
                                                        <IconButton size="small" onClick={() => deleteDonor(donor.id)} sx={{ p: 0.5, color: 'rgba(240,236,228,0.15)', '&:hover': { color: '#960000' } }}>
                                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>
            </Grid>

            {/* Donor Add/Edit Dialog */}
            <Dialog
                open={isDonorDialogOpen} onClose={() => setIsDonorDialogOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: '#12121a', border: '1px solid rgba(240,236,228,0.08)', borderRadius: '4px' } }}
            >
                <DialogTitle sx={{ color: '#f0ece4', fontSize: '1rem', fontFamily: '"Noto Serif KR", serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VolunteerActivismIcon sx={{ fontSize: 18, color: '#960000' }} />
                            {editDonor ? '후원자 정보 수정' : '후원자 추가'}
                        </Box>
                        <IconButton onClick={() => setIsDonorDialogOpen(false)} sx={{ color: 'rgba(240,236,228,0.3)' }} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="성명 *" fullWidth size="small" value={donorForm.name} onChange={e => setDonorForm({ ...donorForm, name: e.target.value })} sx={textFieldSx} />
                        <TextField label="후원 일자" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={donorForm.donated_at} onChange={e => setDonorForm({ ...donorForm, donated_at: e.target.value })} sx={textFieldSx} />
                        <TextField label="후원 금액 (원, 선택)" type="number" fullWidth size="small" value={donorForm.amount} onChange={e => setDonorForm({ ...donorForm, amount: e.target.value })} sx={textFieldSx} />
                        <TextField label="한마디 (선택)" fullWidth size="small" placeholder="예: 좋은 공연 많이 해주세요" value={donorForm.message} onChange={e => setDonorForm({ ...donorForm, message: e.target.value })} sx={textFieldSx} />
                        <FormControlLabel
                            control={<Switch checked={donorForm.is_visible} onChange={e => setDonorForm({ ...donorForm, is_visible: e.target.checked })} size="small" sx={{ '& .MuiSwitch-thumb': { bgcolor: donorForm.is_visible ? '#960000' : undefined }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: 'rgba(150,0,0,0.4)' } }} />}
                            label={<Typography sx={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.5)' }}>사이트에 후원자 이름 노출</Typography>}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsDonorDialogOpen(false)} sx={{ color: 'rgba(240,236,228,0.4)', fontSize: '0.8rem' }}>취소</Button>
                    <Button
                        onClick={handleSaveDonor} variant="outlined"
                        disabled={!donorForm.name.trim()}
                        sx={{ borderColor: '#960000', color: '#f0ece4', fontSize: '0.8rem', '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.08)' } }}
                    >
                        {editDonor ? '수정 완료' : '등록'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ bgcolor: snack.severity === 'success' ? 'rgba(0,100,0,0.9)' : 'rgba(150,0,0,0.9)', color: '#f0ece4', '& .MuiAlert-icon': { color: '#f0ece4' } }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}


function PerformanceVideoManagement() {
    const { settings, updateSetting } = useAdminSiteSettings();
    const [videoInput, setVideoInput] = useState('');
    const [category, setCategory] = useState('regular');
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
    // 로컬 상태로 즉각 반영 (낙관적 업데이트)
    const [localCategories, setLocalCategories] = useState(null);

    // settings에서 로드되면 localCategories 초기화
    useEffect(() => {
        if (settings.performance_categories) {
            setLocalCategories(settings.performance_categories);
        }
    }, [settings.performance_categories]);

    const categories = localCategories || settings.performance_categories || { regular: [], general: [] };

    const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

    const handleAdd = async () => {
        const val = videoInput.trim();
        if (!val) return;

        // 즉각 로컬 반영
        const updated = {
            regular: [...(categories.regular || [])],
            general: [...(categories.general || [])],
        };
        updated[category] = [...updated[category], val];
        setLocalCategories(updated);
        setVideoInput('');

        // Supabase 저장
        setSaving(true);
        const { error } = await updateSetting('performance_categories', updated);
        setSaving(false);

        if (error) {
            // 실패 시 롤백
            setLocalCategories(categories);
            setVideoInput(val);
            console.error('performance_categories save error:', error);
            showSnack(`저장 오류: ${error.message || '알 수 없는 오류'}`, 'error');
        } else {
            showSnack('영상 URL이 추가되었습니다.');
        }
    };

    const handleRemove = async (cat, idx) => {
        const updated = {
            regular: [...(categories.regular || [])],
            general: [...(categories.general || [])],
        };
        updated[cat] = updated[cat].filter((_, i) => i !== idx);

        // 즉각 로컬 반영
        setLocalCategories(updated);

        const { error } = await updateSetting('performance_categories', updated);
        if (error) {
            setLocalCategories(categories);
            showSnack(`삭제 오류: ${error.message || '알 수 없는 오류'}`, 'error');
        }
    };

    return (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(240,236,228,0.08)' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240,236,228,0.4)', fontWeight: 600, letterSpacing: '0.08em', mb: 2 }}>
                공연 영상 카테고리 관리
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    size="small"
                    variant={category === 'regular' ? 'contained' : 'outlined'}
                    onClick={() => setCategory('regular')}
                    sx={{
                        fontSize: '0.7rem',
                        ...(category === 'regular'
                            ? { bgcolor: '#960000', '&:hover': { bgcolor: '#7a0000' } }
                            : { borderColor: 'rgba(240,236,228,0.2)', color: 'rgba(240,236,228,0.5)', '&:hover': { borderColor: '#960000' } })
                    }}
                >
                    정기/기획공연
                </Button>
                <Button
                    size="small"
                    variant={category === 'general' ? 'contained' : 'outlined'}
                    onClick={() => setCategory('general')}
                    sx={{
                        fontSize: '0.7rem',
                        ...(category === 'general'
                            ? { bgcolor: '#31466b', '&:hover': { bgcolor: '#253654' } }
                            : { borderColor: 'rgba(240,236,228,0.2)', color: 'rgba(240,236,228,0.5)', '&:hover': { borderColor: '#31466b' } })
                    }}
                >
                    일반공연
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    value={videoInput}
                    onChange={e => setVideoInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && videoInput.trim()) handleAdd(); }}
                    placeholder="YouTube URL 입력 후 추가"
                    disabled={saving}
                    sx={textFieldSx}
                />
                <Button
                    variant="outlined"
                    onClick={handleAdd}
                    disabled={saving || !videoInput.trim()}
                    sx={{ borderColor: '#960000', color: '#f0ece4', fontSize: '0.78rem', whiteSpace: 'nowrap', '&:hover': { borderColor: '#c43030', bgcolor: 'rgba(150,0,0,0.08)' } }}
                >
                    {saving ? '저장 중' : '추가'}
                </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
                {['regular', 'general'].map(cat => (
                    <Box key={cat} sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: cat === 'regular' ? 'rgba(150,0,0,0.7)' : 'rgba(49,70,107,0.7)', fontWeight: 700, letterSpacing: '0.06em', mb: 0.8 }}>
                            {cat === 'regular' ? '[ 정기/기획공연 ]' : '[ 일반공연 ]'}
                            <span style={{ color: 'rgba(240,236,228,0.25)', fontWeight: 400, marginLeft: 6 }}>
                                {categories[cat]?.length || 0}개
                            </span>
                        </Typography>
                        {(!categories[cat] || categories[cat].length === 0) ? (
                            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.2)', py: 1 }}>등록된 영상이 없습니다</Typography>
                        ) : (
                            categories[cat].map((url, i) => (
                                <Box key={i} sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    bgcolor: 'rgba(10,10,15,0.4)', p: 1, mt: 0.5, borderRadius: '3px',
                                    border: '1px solid rgba(240,236,228,0.04)',
                                }}>
                                    <Typography sx={{ fontSize: '0.68rem', color: 'rgba(240,236,228,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                                        {url}
                                    </Typography>
                                    <IconButton size="small" onClick={() => handleRemove(cat, i)} sx={{ color: 'rgba(240,236,228,0.2)', '&:hover': { color: '#960000' }, p: 0.3 }}>
                                        <DeleteIcon sx={{ fontSize: 13 }} />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>
                ))}
            </Box>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ bgcolor: snack.severity === 'success' ? 'rgba(0,100,0,0.9)' : 'rgba(150,0,0,0.9)', color: '#f0ece4', '& .MuiAlert-icon': { color: '#f0ece4' } }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

