/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// CSP 정책 구성
// - YouTube iframe embed를 허용
// - Supabase API/Storage 허용
// - eval() / inline script 허용 안 함 (Vite HMR 때문에 개발 중에는 unsafe-eval 허용)
const supabaseHost = process.env.VITE_SUPABASE_URL
  ? new URL(process.env.VITE_SUPABASE_URL).hostname
  : '*.supabase.co';

const isDev = process.env.NODE_ENV !== 'production';

const CSP = [
  `default-src 'self'`,
  // scripts: 개발(HMR)은 unsafe-eval 허용, 프로덕션은 차단
  `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : ''} https://www.youtube.com https://s.ytimg.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  // Supabase API + 유튜브 API
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://api.supabase.co`,
  // 이미지: Supabase storage + 유튜브 썸네일
  `img-src 'self' data: blob: https://${supabaseHost} https://i.ytimg.com https://img.youtube.com`,
  // iframe: 유튜브 embed만 허용 (SSRF/Clickjacking 방어)
  `frame-src https://www.youtube.com https://youtube.com`,
  // 미디어: Supabase storage
  `media-src 'self' blob: https://${supabaseHost}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  // X-Frame-Options 대체
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ');

// More info at: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // 개발 서버 보안 헤더
    headers: {
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '0',             // 레거시이며 CSP로 대체
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  test: {
    projects: [
      // ─── Storybook browser tests ───
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          },
          setupFiles: ['.storybook/vitest.setup.js']
        }
      },
      // ─── Unit tests (security modules) ───
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{js,jsx,ts,tsx}'],
          globals: true,
        }
      }
    ]
  }
});