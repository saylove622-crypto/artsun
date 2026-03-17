# 사단법인 아트컴퍼니 아르선 (ART-SUN) 공식 웹사이트

사단법인 아트컴퍼니 아르선의 공식 웹사이트 개발 프로젝트입니다. 아르선의 예술적 가치를 시각적으로 전달하고, 단원 모집 및 후원, 공연 문의 등을 효율적으로 관리하기 위한 프리미엄 플랫폼입니다.

## 🔗 Live Demo
- **URL**: [https://artsun.vercel.app](https://artsun.vercel.app) (배포 주소)

## 🎨 디자인 컨셉
- **Premium Identity**: 깊은 레드(#960000)와 세련된 네이비(#31466b)를 활용한 프리미엄 아트 감성
- **Typography**: `Noto Serif KR`과 `Noto Sans KR`을 조화시켜 전통의 우아함과 현대의 깔끔함을 동시에 표현
- **Interactive UX**: `Framer Motion`을 활용한 부드러운 스크롤 애니메이션과 패럴랙스 효과로 몰입감 있는 사용자 경험 제공

## 🚀 주요 기능 및 섹션
- **단체 소개 (About Us)**: 아르선의 비전과 가치를 담은 소개 섹션
- **활동 내역 (Activity History)**: 주요 공연 및 행사 내역 (페이지네이션 적용)
- **공연 활동 (Performances)**: 아르선의 대표 공연 포트폴리오
- **단원 모집 및 교육 (Recruitment)**: 신입 단원 모집 및 자격증 과정 안내 (탭 인터페이스)
- **후원 안내 (Donation)**: 아르선 후원 방법 및 후원자 명예의 전당 (애니메이션 적용)
- **영상 갤러리 (Gallery)**: 주요 활동 영상 모음
- **오시는 길 (Location)**: 구글 지도 API 연동 및 네이버 지도 길찾기 링크 제공
- **연락처 및 문의 (Contact)**: 실시간 문의 폼 및 연락처 정보 (유형별 문의 선택)

## 🛡️ 보안 아키텍처 (Security Hardening)
- **XSS Protection**: `DOMPurify`를 통한 사용자 입력 데이터 정화(Sanitization)
- **Authentication**: Supabase Auth 연동 및 보안 강화된 어드민 로그인 시스템
- **Brute-force Defense**: 로그인 실패 횟수 제한 및 IP 기반 Rate Limiting 로직 적용
- **Data Integrity**: Supabase RLS(Row Level Security)를 통한 안전한 데이터 접근 제어
- **Audit System**: 모든 데이터 변경 사항에 대한 감사 로그(Audit Log) 자동 기록

## 🛠️ 기술 스택
- **Frontend**: `React 19`, `Vite`, `Material UI (MUI)`, `Framer Motion`
- **Backend/Database**: `Supabase` (PostgreSQL, Auth, Storage)
- **Deployment**: `Vercel`
- **Security**: `DOMPurify`, `CSP`, `Rate Limiting`
- **Testing**: `Vitest`, `ESLint`

## 📅 프로젝트 로드맵 (Completed ✅)
- [x] **Phase 1~4**: 핵심 아키텍처 및 디자인 시스템 구축
- [x] **Phase 5**: 보안 시스템 고도화 및 유닛 테스트 완료
- [x] **Phase 6**: Vercel 배포 및 운영 환경 최적화 완료 (2026-03-08)

## 💻 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 Supabase 정보를 입력합니다.
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. 로컬 서버 실행
```bash
npm run dev
```

### 4. 테스트 실행
```bash
npm run test:unit
```

---

© 2026 사단법인 아트컴퍼니 아르선. All rights reserved.