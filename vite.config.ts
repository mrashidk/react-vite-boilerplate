import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@common': '/src/modules/common',
      '@api': '/src/config/api/api.config',
      '@session': '/src/config/session/session.config',
      '@utils': '/src/modules/common/services/utils.service',
      '@variable': '/src/config/variables/system.variable',
      modules: '/src/modules',
    },
  },
});
