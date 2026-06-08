import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTE: TypeScript declarations are emitted by a dedicated `vue-tsc` step
// (see the "build" script in package.json), not by vite-plugin-dts. The dts
// plugin emitted an empty `export {}` for the re-export barrel entry, breaking
// every consumer import — vue-tsc emits the entry correctly.
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            name: 'AdminUI',
            fileName: 'admin-ui',
        },
        rollupOptions: {
            external: ['vue', 'vue-router'],
            output: {
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                },
            },
        },
        cssCodeSplit: false,
        sourcemap: true,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.js'],
    },
});
