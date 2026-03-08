/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * vitest.unit.config.js
 * 보안 모듈 단위 테스트 전용 설정
 * 실행: npx vitest run --config vitest.unit.config.js
 */
export default defineConfig({
    plugins: [react()],
    test: {
        name: 'unit',
        environment: 'jsdom',
        include: ['src/**/*.test.{js,jsx,ts,tsx}'],
        globals: true,
    },
});
