/**
 * security.test.js
 * 보안 모듈 단위 테스트 (Vitest)
 *
 * 실행: npx vitest run src/system/security/security.test.js
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ─── 1. Sanitization Tests ────────────────────────────────
import {
    sanitizeText,
    sanitizeUrl,
    sanitizeYouTubeUrl,
    isValidEmail,
    isValidPhone,
    sanitizeInquiryForm,
    sanitizeDonor,
} from './sanitize';

describe('sanitize.sanitizeText', () => {
    it('HTML 태그를 제거한다', () => {
        expect(sanitizeText('<script>alert(1)</script>Hello')).toBe('Hello');
        expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
        expect(sanitizeText('<b>굵은 글씨</b>')).toBe('굵은 글씨');
    });

    it('정상 텍스트는 그대로 통과한다', () => {
        expect(sanitizeText('안녕하세요 아르선!')).toBe('안녕하세요 아르선!');
        expect(sanitizeText('2026-03-05')).toBe('2026-03-05');
    });

    it('비문자열 입력은 빈 문자열을 반환한다', () => {
        expect(sanitizeText(null)).toBe('');
        expect(sanitizeText(undefined)).toBe('');
        expect(sanitizeText(123)).toBe('');
    });

    it('앞뒤 공백을 제거한다', () => {
        expect(sanitizeText('  hello  ')).toBe('hello');
    });
});

describe('sanitize.sanitizeUrl', () => {
    it('http/https URL을 허용한다', () => {
        expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
        expect(sanitizeUrl('http://naver.com/path?q=1')).toBe('http://naver.com/path?q=1');
    });

    it('javascript: 스킴을 차단한다', () => {
        expect(sanitizeUrl('javascript:alert(1)')).toBe('');
        expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('');
    });

    it('data: 스킴을 차단한다', () => {
        expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('vbscript: 스킴을 차단한다', () => {
        expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
    });

    it('빈 값과 비문자열을 처리한다', () => {
        expect(sanitizeUrl('')).toBe('');
        expect(sanitizeUrl(null)).toBe('');
    });

    it('잘못된 URL 형식을 차단한다', () => {
        expect(sanitizeUrl('not-a-url')).toBe('');
        expect(sanitizeUrl('://bad')).toBe('');
    });
});

describe('sanitize.sanitizeYouTubeUrl', () => {
    it('유튜브 URL을 허용한다', () => {
        expect(sanitizeYouTubeUrl('https://www.youtube.com/watch?v=abc123')).toBe('https://www.youtube.com/watch?v=abc123');
        expect(sanitizeYouTubeUrl('https://youtu.be/abc123')).toBe('https://youtu.be/abc123');
    });

    it('비유튜브 URL을 차단한다 (SSRF 방어)', () => {
        expect(sanitizeYouTubeUrl('https://evil.com/video')).toBe('');
        expect(sanitizeYouTubeUrl('https://vimeo.com/123')).toBe('');
        expect(sanitizeYouTubeUrl('https://youtube.com.evil.com/watch?v=x')).toBe('');
    });
});

describe('sanitize.isValidEmail', () => {
    it('유효한 이메일을 통과시킨다', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
        expect(isValidEmail('admin@artsun.co.kr')).toBe(true);
    });

    it('잘못된 이메일을 거부한다', () => {
        expect(isValidEmail('notanemail')).toBe(false);
        expect(isValidEmail('@domain.com')).toBe(false);
        expect(isValidEmail('user@')).toBe(false);
    });
});

describe('sanitize.isValidPhone', () => {
    it('유효한 한국 전화번호를 통과시킨다', () => {
        expect(isValidPhone('010-1234-5678')).toBe(true);
        expect(isValidPhone('')).toBe(true); // optional
    });

    it('스크립트 주입을 거부한다', () => {
        expect(isValidPhone('<script>alert(1)</script>')).toBe(false);
        expect(isValidPhone('SELECT * FROM')).toBe(false);
    });
});

describe('sanitize.sanitizeInquiryForm', () => {
    it('XSS 페이로드가 있는 폼을 정제한다', () => {
        const malicious = {
            name: '<img src=x onerror=alert(1)>홍길동',
            email: 'user@example.com',
            phone: '010-1234-5678',
            type: '공연',
            message: '<script>document.cookie</script>문의내용입니다',
        };
        const result = sanitizeInquiryForm(malicious);
        expect(result.name).toBe('홍길동');
        expect(result.message).toBe('문의내용입니다');
        expect(result.email).toBe('user@example.com'); // 이메일은 무해
    });

    it('필드 길이 제한이 적용된다', () => {
        const long = { name: 'a'.repeat(200), email: 'a@b.c', phone: '', type: '', message: 'x'.repeat(6000) };
        const result = sanitizeInquiryForm(long);
        expect(result.name.length).toBeLessThanOrEqual(100);
        expect(result.message.length).toBeLessThanOrEqual(5000);
    });
});

describe('sanitize.sanitizeDonor', () => {
    it('후원자 데이터를 정제한다', () => {
        const data = {
            name: '<b>김후원</b>',
            donated_at: '2026-01-01',
            amount: 100000,
            message: '<script>alert()</script>감사합니다',
            is_visible: true,
        };
        const result = sanitizeDonor(data);
        expect(result.name).toBe('김후원');
        expect(result.message).toBe('감사합니다');
    });

    it('음수 후원금을 0으로 처리한다', () => {
        const result = sanitizeDonor({ name: '홍길동', amount: -500, is_visible: true });
        expect(result.amount).toBe(0);
    });
});

// ─── 2. Rate Limiter Tests ────────────────────────────────
import {
    isLockedOut,
    recordFailedAttempt,
    resetAttempts,
    formatRemainingTime,
} from './rateLimiter';

// localStorage mock
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

describe('rateLimiter', () => {
    beforeEach(() => {
        Object.defineProperty(globalThis, 'localStorage', {
            value: localStorageMock,
            writable: true,
        });
        localStorageMock.clear();
    });

    it('초기 상태는 잠금이 아니다', () => {
        expect(isLockedOut().locked).toBe(false);
    });

    it('5회 실패 후 잠금 상태가 된다', () => {
        recordFailedAttempt();
        recordFailedAttempt();
        recordFailedAttempt();
        recordFailedAttempt();
        const result = recordFailedAttempt(); // 5번째
        expect(result.locked).toBe(true);
        expect(isLockedOut().locked).toBe(true);
    });

    it('리셋 후 잠금이 해제된다', () => {
        for (let i = 0; i < 5; i++) recordFailedAttempt();
        resetAttempts();
        expect(isLockedOut().locked).toBe(false);
    });

    it('formatRemainingTime이 올바른 형식을 반환한다', () => {
        expect(formatRemainingTime(90000)).toBe('01:30');
        expect(formatRemainingTime(60000)).toBe('01:00');
        expect(formatRemainingTime(5000)).toBe('00:05');
    });
});
