/**
 * security/auditLog.js
 * 감사 로그 (Audit Log)
 *
 * 민감한 관리자 작업을 Supabase DB의 audit_logs 테이블에 기록합니다.
 * 실패한 로그인 시도, 데이터 변경, 삭제 작업을 추적합니다.
 *
 * ▶ 활성화하려면 Supabase에 아래 테이블을 생성하세요:
 *   (supabase_schema.sql의 audit_logs 섹션 참고)
 */
import { supabase } from '../utils/supabase';

const AUDIT_ENABLED = true; // 필요시 false로 비활성화

/**
 * @param {'LOGIN_SUCCESS'|'LOGIN_FAILED'|'LOGIN_LOCKED'|'LOGOUT'|
 *         'ACTIVITY_CREATE'|'ACTIVITY_UPDATE'|'ACTIVITY_DELETE'|
 *         'DONOR_CREATE'|'DONOR_UPDATE'|'DONOR_DELETE'|
 *         'SECTION_UPDATE'|'INQUIRY_DELETE'|'SETTINGS_UPDATE'} action
 * @param {object} [meta]  추가 컨텍스트 (ID, 제목 등). 개인정보 포함 금지.
 */
export async function logAudit(action, meta = {}) {
    if (!AUDIT_ENABLED) return;

    const entry = {
        action,
        meta: JSON.stringify(meta),
        user_agent: navigator.userAgent.slice(0, 200),
        occurred_at: new Date().toISOString(),
    };

    try {
        await supabase.from('audit_logs').insert([entry]);
    } catch (err) {
        // 로그 실패는 조용히 처리 (앱 플로우를 막지 않음)
        console.warn('[AuditLog] Failed to write log:', err?.message);
    }
}

/** 편의 함수들 */
export const auditLoginSuccess = (identifier) =>
    logAudit('LOGIN_SUCCESS', { identifier });

export const auditLoginFailed = (identifier) =>
    logAudit('LOGIN_FAILED', { identifier });

export const auditLoginLocked = (identifier) =>
    logAudit('LOGIN_LOCKED', { identifier });

export const auditLogout = () =>
    logAudit('LOGOUT');

export const auditActivityCreate = (title) =>
    logAudit('ACTIVITY_CREATE', { title });

export const auditActivityUpdate = (id, title) =>
    logAudit('ACTIVITY_UPDATE', { id, title });

export const auditActivityDelete = (id) =>
    logAudit('ACTIVITY_DELETE', { id });

export const auditDonorDelete = (id) =>
    logAudit('DONOR_DELETE', { id });

export const auditSettingsUpdate = (key) =>
    logAudit('SETTINGS_UPDATE', { key });

export const auditInquiryDelete = (id) =>
    logAudit('INQUIRY_DELETE', { id });
