/**
 * useAuth.js – 인증 컨텍스트
 *
 * 보안 개선 사항:
 *  ✅ 하드코딩 크리덴셜 완전 제거 → Supabase Auth 전용
 *  ✅ Rate Limit / Brute-force 방어 (5회 실패 → 10분 잠금)
 *  ✅ 로그인 성공/실패/잠금 Audit Log 기록
 *  ✅ 에러 메시지 내부 정보 노출 차단 (사용자에게는 일반 메시지만)
 *  ✅ 세션 만료 자동 감지 (onAuthStateChange)
 *  ✅ localStorage에 절대 크리덴셜 저장 안 함 (Supabase SDK의 내부 스토리지만 사용)
 */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase';
import {
  isLockedOut,
  recordFailedAttempt,
  resetAttempts,
  formatRemainingTime,
} from '../security/rateLimiter';
import {
  auditLoginSuccess,
  auditLoginFailed,
  auditLoginLocked,
  auditLogout,
} from '../security/auditLog';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Supabase 세션 복원 (SDK가 자체 스토리지에서 처리)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // 세션 상태 변화 구독 (다른 탭 로그아웃, 토큰 만료 등 자동 처리)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * 로그인
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, error?: string }}
   */
  const login = async (email, password) => {
    // 1. Rate limit 확인
    const lockStatus = isLockedOut();
    if (lockStatus.locked) {
      const remaining = formatRemainingTime(lockStatus.remainingMs);
      await auditLoginLocked(email?.slice(0, 50));
      return {
        success: false,
        error: `로그인 시도 초과로 ${remaining} 동안 잠금 처리되었습니다. 잠시 후 다시 시도해주세요.`,
      };
    }

    // 2. 입력 기본 검증 (내부 에러가 사용자에게 노출되지 않도록)
    if (!email || !password) {
      return { success: false, error: '아이디와 비밀번호를 모두 입력해주세요.' };
    }

    // 3. Supabase Auth 로그인 시도
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.session) {
        const result = recordFailedAttempt();
        await auditLoginFailed(email?.slice(0, 50));

        if (result.locked) {
          return {
            success: false,
            error: '로그인 시도 횟수를 초과했습니다. 10분 후 다시 시도해주세요.',
          };
        }

        const remaining = 5 - result.attempts;
        // 내부 Supabase 에러 메시지는 사용자에게 노출하지 않음
        return {
          success: false,
          error: `아이디 또는 비밀번호가 올바르지 않습니다. (${remaining}회 남음)`,
        };
      }

      // 성공
      resetAttempts();
      await auditLoginSuccess(email?.slice(0, 50));
      return { success: true };

    } catch {
      // 네트워크 오류 등 — 내부 에러 스택 노출 금지
      return { success: false, error: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
    }
  };

  const logout = async () => {
    await auditLogout();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { isAuthenticated, loading, login, logout, user } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default useAuth;
