/**
 * security/rateLimiter.js
 * 클라이언트-사이드 Rate Limiter (로그인 Brute-force 방어)
 *
 * 구조:
 *  - localStorage 기반의 시도 횟수 + 잠금 타이머
 *  - MAX_ATTEMPTS 초과 시 LOCKOUT_MS 동안 로그인 시도 차단
 *
 * ⚠️ 클라이언트-사이드 rate limit는 우회 가능합니다.
 *    진정한 방어는 Supabase Auth 내장 rate limit + Supabase DB 정책 레벨에서 동작합니다.
 *    이 모듈은 UX 피드백 및 1차 방어선으로 동작합니다.
 */

const MAX_ATTEMPTS = 5;           // 최대 허용 시도 횟수
const LOCKOUT_MS = 10 * 60 * 1000; // 10분 잠금
const STORAGE_KEY = 'arseon_login_attempts';

function getState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
    } catch {
        return { count: 0, lockedUntil: 0 };
    }
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** 현재 잠금 여부 확인 */
export function isLockedOut() {
    const state = getState();
    if (state.lockedUntil > Date.now()) {
        return { locked: true, remainingMs: state.lockedUntil - Date.now() };
    }
    return { locked: false, remainingMs: 0 };
}

/** 로그인 실패 기록 */
export function recordFailedAttempt() {
    const state = getState();
    // 이전 잠금이 해제된 경우 카운터 리셋
    if (state.lockedUntil && state.lockedUntil < Date.now()) {
        saveState({ count: 1, lockedUntil: 0 });
        return { attempts: 1, locked: false };
    }
    const newCount = (state.count || 0) + 1;
    const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : state.lockedUntil;
    saveState({ count: newCount, lockedUntil });
    return { attempts: newCount, locked: newCount >= MAX_ATTEMPTS };
}

/** 로그인 성공 시 카운터 리셋 */
export function resetAttempts() {
    localStorage.removeItem(STORAGE_KEY);
}

/** 남은 잠금 시간을 "MM:SS" 형식으로 반환 */
export function formatRemainingTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
