# 프로젝트 아르선 (ART-SUN) 공식 웹사이트

사단법인 아트컴퍼니 아르선의 공식 웹사이트 개발 프로젝트입니다. 아르선의 예술적 가치를 시각적으로 전달하고, 단원 모집 및 후원, 공연 문의 등을 효율적으로 관리하기 위한 플랫폼입니다.

## 🎨 디자인 컨셉
- **브랜드 컬러**: 깊은 레드(#960000)와 세련된 네이비(#31466b)를 포인트로 한 프리미엄 아트 감성
- **타이포그래피**: Noto Serif KR 및 Noto Sans KR을 활용하여 전통과 현대의 조화를 표현
- **인터랙션**: 부드러운 스크롤 리빌(Scroll Reveal) 및 패럴랙스 효과로 몰입감 있는 사용자 경험 제공

## 🚀 기술 스택
- **Frontend**: React 19, Vite, Material UI (MUI 7+), Framer Motion
- **Backend/DB**: Supabase (Auth, PostgreSQL, Storage)
- **Security**: DOMPurify (XSS Protection), CSP, HSTS, Rate Limiting
- **Dev & Test**: Storybook, Vitest, Playwright, ESLint

## 🛡️ 보안 아키텍처 (Security Hardening)
웹사이트의 안정성과 데이터 보호를 위해 다음과 같은 보안 계층이 적용되었습니다:
- **XSS 방어**: `DOMPurify`를 통한 모든 사용자 입력 Sanitization 처리 및 React 기본 Escape 처리
- **인증 보안**: 하드코딩된 크리덴셜 제거 및 Supabase Auth 통합 (Bcrypt 기반)
- **Brute-force 방어**: 로그인 5회 실패 시 10분간 클라이언트 사이드 잠금(Rate Limiting) 적용
- **데이터 무결성**: Supabase RLS(Row Level Security) 정책을 통한 비인증 사용자의 쓰기/수정 차단
- **감사 로그(Audit Log)**: 관리자의 주요 활동(로그인, 데이터 변경, 삭제)을 DB에 기록
- **보안 헤더**: CSP(Content Security Policy), HSTS, X-Frame-Options 등 최신 보안 규격 적용

## 🗺️ 구현 로드맵

### Phase 1~4: 기반 구축 및 어드민 시스템 (Completed ✅)
- [x] 브랜드 아이덴티티 반영 MUI 커스텀 테마 및 반응형 레이아웃
- [x] 패럴랙스 히어로 섹션 및 밸류 체계 리빌 애니메이션
- [x] 관리자 대시보드 (섹션, 활동, 후원, 문의, 설정 통합 관리)

### Phase 5: 보안 및 시스템 고도화 (Completed ✅)
- [x] **Security Hardening**: XSS, CSRF, Brute-force 방어 시스템 구축
- [x] **Audit System**: 데이터 변경 이력 추적을 위한 감사 로그 테이블 구축
- [x] **Validation**: DB 및 어플리케이션 레벨의 정교한 데이터 검증 로직 적용
- [x] **Unit Testing**: 보안 모듈(Sanitize, RateLimit) 단위 테스트 100% 통과 (24/24)

### Phase 6: 배포 및 운영 최적화 (Planned 📅)
- [ ] **Deployment**: Vercel/Netlify 자동 배포 및 도메인 연결
- [ ] **SEO**: SSR 또는 정적 메타 태그 최적화 및 검색 엔진 등록
- [ ] **Analytics**: Google Analytics 4 연동을 통한 방문자 통계 수집

---

## 🛠️ 최근 업데이트 (2026-03-08)
- **보안 강화**: 24개의 보안 관련 유닛 테스트 통과 및 프로덕션 취약점 0개 달성
- **DB 아키텍처**: 활동 내역(Activities), 후원자(Donors), 감사 로그(Audit Logs) 테이블 설계 및 RLS 적용
- **섹션 디자인**: 레이아웃 간격(Padding) 일관성 확보 및 모바일 최적화

---

## 💻 시작하기

### 1. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 Supabase 정보를 입력합니다.
```bash
cp .env.example .env
```

### 2. 의존성 설치 및 실행
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 보안 유닛 테스트 실행
npm run test:unit
```

### 3. Supabase 초기화
1. `supabase_schema.sql`을 실행하여 기본 테이블을 생성합니다.
2. `supabase_security_migration.sql`을 실행하여 RLS 정책 및 감사 로그 시스템을 활성화합니다.
3. Supabase Auth에서 관리자 이메일 계정을 생성합니다.

---

© 2026 Art Company ART-SUN. All rights reserved.