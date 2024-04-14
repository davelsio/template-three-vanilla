import { defineConfig } from 'vite';
import { glslify } from 'vite-plugin-glslify';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [glslify(), tsconfigPaths()],
});
