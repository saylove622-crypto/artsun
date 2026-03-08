-- ============================================================
-- ArSeon Project – Supabase Security Migration
-- 실행 방법: Supabase Dashboard > SQL Editor에서 전체 실행
--
-- 변경 사항:
--  1. audit_logs 테이블 신규 추가
--  2. RLS 정책 최소권한 원칙으로 재설계
--     - 비인증(anon) : SELECT만 허용 (공개 데이터)
--     - 인증(authenticated) : 관리자 조작 허용
--
-- ▶ 기존 "Public Write" 정책들은 anon도 쓰기 가능한 취약점이 있음.
--    inquiries INSERT는 anon이 필요하므로 유지하되, DELETE/UPDATE는 인증 필요로 변경.
-- ============================================================

-- ─────────────────────────────────────────────
-- 8. Audit Logs Table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action      TEXT NOT NULL,
    meta        JSONB,
    user_agent  TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- anon은 audit_logs 읽기/쓰기 불가 (보안 로그 보호)
-- authenticated만 INSERT (클라이언트에서 로그 기록)
CREATE POLICY "Auth Insert Audit Logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 관리자만 감사 로그 열람 (향후 별도 admin role)
CREATE POLICY "Auth Read Audit Logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (true);


-- ─────────────────────────────────────────────
-- RLS 정책 재설계 – 최소권한 원칙
-- ─────────────────────────────────────────────

-- ▼ 기존 과도한 "Public Write" 정책 제거
-- (이미 적용된 경우에만 실행; 없으면 오류 무시)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Write Sections"      ON public.sections;
    DROP POLICY IF EXISTS "Public Insert Images"       ON public.section_images;
    DROP POLICY IF EXISTS "Public Update Images"       ON public.section_images;
    DROP POLICY IF EXISTS "Public Delete Images"       ON public.section_images;
    DROP POLICY IF EXISTS "Public Update Inquiries"    ON public.inquiries;
    DROP POLICY IF EXISTS "Public Delete Inquiries"    ON public.inquiries;
    DROP POLICY IF EXISTS "Public Write Activities"    ON public.activities;
    DROP POLICY IF EXISTS "Public Write Side Notices"  ON public.side_notices;
    DROP POLICY IF EXISTS "Public Write Settings"      ON public.site_settings;
    DROP POLICY IF EXISTS "Public Write Donors"        ON public.donors;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- sections: 읽기는 공개, 쓰기는 인증 필요
CREATE POLICY "Auth Update Sections"
    ON public.sections FOR UPDATE
    TO authenticated
    USING (true) WITH CHECK (true);

-- section_images: 읽기는 공개, CUD는 인증 필요
CREATE POLICY "Auth Insert Images"
    ON public.section_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Auth Update Images"
    ON public.section_images FOR UPDATE
    TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Auth Delete Images"
    ON public.section_images FOR DELETE
    TO authenticated
    USING (true);

-- inquiries: anon INSERT(문의 접수)는 유지, UPDATE/DELETE는 인증 필요
CREATE POLICY "Auth Update Inquiries"
    ON public.inquiries FOR UPDATE
    TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Auth Delete Inquiries"
    ON public.inquiries FOR DELETE
    TO authenticated
    USING (true);

-- activities: CUD는 인증 필요
CREATE POLICY "Auth Write Activities"
    ON public.activities FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

-- side_notices: CUD는 인증 필요
CREATE POLICY "Auth Write Side Notices"
    ON public.side_notices FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

-- site_settings: CUD는 인증 필요
CREATE POLICY "Auth Write Settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

-- donors: 공개 쓰기 제거, 인증 필요
CREATE POLICY "Auth Write Donors"
    ON public.donors FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 입력 길이 제한 (DB 레벨 SQLi/과부하 방어)
-- ─────────────────────────────────────────────
ALTER TABLE public.inquiries
    ADD CONSTRAINT inquiries_name_length   CHECK (char_length(name)    <= 100),
    ADD CONSTRAINT inquiries_email_length  CHECK (char_length(email)   <= 254),
    ADD CONSTRAINT inquiries_phone_length  CHECK (char_length(phone)   <= 30),
    ADD CONSTRAINT inquiries_message_length CHECK (char_length(message) <= 5000);

ALTER TABLE public.activities
    ADD CONSTRAINT activities_title_length CHECK (char_length(title) <= 200);

ALTER TABLE public.donors
    ADD CONSTRAINT donors_name_length    CHECK (char_length(name) <= 100),
    ADD CONSTRAINT donors_message_length CHECK (char_length(message) <= 500);
