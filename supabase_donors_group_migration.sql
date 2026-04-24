-- ============================================================
-- ArSeon Project – donors group 컬럼 추가 마이그레이션
-- 실행 방법: Supabase Dashboard > SQL Editor에서 전체 실행
--
-- 변경 사항:
--  donors 테이블에 group_name 컬럼 추가
--  (그룹별 후원 전당 분류용: 예) 개인, 단체, 기업 등)
-- ============================================================

ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT '개인';
