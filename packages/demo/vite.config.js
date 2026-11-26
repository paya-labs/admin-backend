import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, lazyPlugins } from 'vite-plus';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: lazyPlugins(() => [vue(), tailwindcss()]),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
    },
});
