import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint .',
      },
    }),
  ],
});
