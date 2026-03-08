/**
 * security/sanitize.js
 * XSS 방어 – DOMPurify 기반 입력 Sanitization
 *
 * 규칙:
 *  - 모든 사용자 입력(문의폼, 활동내역, 후원자 등)은 이 함수를 통과한 후에만 DB에 저장한다.
 *  - 렌더링 시에는 React의 기본 이스케이프가 XSS를 막으므로 dangerouslySetInnerHTML은 사용하지 않는다.
 *  - URL 필드(map_url, poster_url 등)는 whitelist 방식으로 별도 검증한다.
 */
import DOMPurify from 'dompurify';

/** 일반 텍스트 필드: HTML 태그 전부 제거 */
export function sanitizeText(input) {
    if (typeof input !== 'string') return '';
    // ALLOWED_TAGS: [] → 모든 태그 제거, ALLOWED_ATTR: [] → 속성도 제거
    return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/** URL 필드: http/https 스킴만 허용 (javascript: data: 등 차단) */
export function sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    try {
        const parsed = new URL(trimmed);
        if (!['https:', 'http:'].includes(parsed.protocol)) {
            console.warn('[Security] Blocked unsafe URL scheme:', parsed.protocol);
            return '';
        }
        return trimmed;
    } catch {
        return '';
    }
}

/** YouTube URL 검증: 허가된 호스트만 통과 */
const YOUTUBE_HOSTS = ['www.youtube.com', 'youtube.com', 'youtu.be', 'www.youtu.be'];
export function sanitizeYouTubeUrl(url) {
    const safe = sanitizeUrl(url);
    if (!safe) return '';
    try {
        const parsed = new URL(safe);
        if (!YOUTUBE_HOSTS.includes(parsed.hostname)) {
            console.warn('[Security] Blocked non-YouTube URL:', parsed.hostname);
            return '';
        }
        return safe;
    } catch {
        return '';
    }
}

/** 이메일 기본 검증 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** 연락처 검증 (숫자/하이픈/공백/+/() 허용, 최소 7자) */
export function isValidPhone(phone) {
    if (!phone) return true; // optional field
    return /^[\d\s\-+()]{7,20}$/.test(phone);
}

/**
 * 문의 폼 전체 sanitize
 * @param {object} form
 * @returns {object} sanitized form
 */
export function sanitizeInquiryForm(form) {
    return {
        name: sanitizeText(form.name).slice(0, 100),
        email: sanitizeText(form.email).slice(0, 254),
        phone: sanitizeText(form.phone || '').slice(0, 30),
        type: sanitizeText(form.type || '').slice(0, 50),
        message: sanitizeText(form.message).slice(0, 5000),
    };
}

/**
 * 활동 내역 sanitize
 */
export function sanitizeActivity(data) {
    return {
        title: sanitizeText(data.title).slice(0, 200),
        organizer: sanitizeText(data.organizer || '').slice(0, 200) || null,
        sponsor: sanitizeText(data.sponsor || '').slice(0, 200) || null,
        event_date: data.event_date || null,
        location: sanitizeText(data.location || '').slice(0, 300) || null,
        runtime: sanitizeText(data.runtime || '').slice(0, 50) || null,
        poster_url: null, // URL은 업로드 후 Supabase Storage에서 직접 가져옴
    };
}

/**
 * 후원자 sanitize
 */
export function sanitizeDonor(data) {
    return {
        name: sanitizeText(data.name).slice(0, 100),
        donated_at: data.donated_at || null,
        amount: Number.isInteger(data.amount) ? Math.max(0, data.amount) : null,
        message: sanitizeText(data.message || '').slice(0, 500) || null,
        is_visible: Boolean(data.is_visible),
    };
}
