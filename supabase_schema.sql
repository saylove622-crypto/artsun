-- ArSeon Project Supabase Schema

-- 1. Sections Table
CREATE TABLE public.sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    video_urls TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Section Images Table
CREATE TABLE public.section_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT REFERENCES public.sections(key) ON DELETE CASCADE,
    url TEXT NOT NULL,
    name TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inquiries Table
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. [NEW] Activities Table (활동 내역)
CREATE TABLE public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,           -- 행사명
    organizer TEXT,                -- 주최/주관
    sponsor TEXT,                  -- 후원
    event_date DATE,               -- 일시 (날짜만 혹은 시간 포함)
    location TEXT,                 -- 장소
    runtime TEXT,                  -- 런닝타임
    poster_url TEXT,               -- 포스터 이미지 URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. [NEW] Side Notices Table (활동내역 옆 기타 공지사항)
CREATE TABLE public.side_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. [NEW] Site Settings Table (단원모집, 자격증, 후원, 오시는길 등 통합 관리)
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Sections
INSERT INTO public.sections (key, label)
VALUES 
    ('hero', 'Hero 메인 배경'),
    ('about', '단체 소개'),
    ('performances', '공연 활동'),
    ('gallery', '영상/사진 갤러리')
ON CONFLICT (key) DO NOTHING;

-- Insert Default Settings
INSERT INTO public.site_settings (key, value)
VALUES 
    ('recruitment', '{"recruitment_info": "", "certification_info": ""}'),
    ('donation', '{"bank_name": "", "account_number": "", "account_holder": "", "message": ""}'),
    ('location', '{"address": "", "map_url": "", "phone": ""}'),
    ('performance_categories', '{"regular": [], "general": []}') -- 기존 section video_urls 대신 사용하거나 확장
ON CONFLICT (key) DO NOTHING;

-- 7. [NEW] Donors Table (후원자 명단)
CREATE TABLE public.donors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,                -- 후원자 성명
    donated_at DATE,                   -- 후원 일자
    amount INTEGER,                    -- 후원 금액 (선택, 단위: 원)
    message TEXT,                      -- 한마디 (선택)
    is_visible BOOLEAN DEFAULT true,   -- 사이트 노출 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.side_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Policies: Public Full Access (anon + authenticated)
CREATE POLICY "Public Read Sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Public Write Sections" ON public.sections FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Images" ON public.section_images FOR SELECT USING (true);
CREATE POLICY "Public Insert Images" ON public.section_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Images" ON public.section_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete Images" ON public.section_images FOR DELETE USING (true);

CREATE POLICY "Public Read Inquiries" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Inquiries" ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete Inquiries" ON public.inquiries FOR DELETE USING (true);

CREATE POLICY "Public Read Activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Public Write Activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Side Notices" ON public.side_notices FOR SELECT USING (true);
CREATE POLICY "Public Write Side Notices" ON public.side_notices FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Public Write Donors" ON public.donors FOR ALL USING (true) WITH CHECK (true);
