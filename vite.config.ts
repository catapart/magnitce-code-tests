import { defineConfig } from "vite";
import { default as terser } from '@rollup/plugin-terser';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        
    },
    build: {
        lib: {
            entry: ['src/code-tests.ts'],
        },
        minify: false,
        copyPublicDir: false,
        rollupOptions: {
            external: [
                '**/*tests.ts',
                '**/*tests.js',
            ],
            output: [
                {
                    dir: 'dist',
                    entryFileNames: 'code-tests.js',
                    format: 'es',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'code-tests.min.js',
                    format: 'es',
                    plugins: [terser()]
                },
                {
                    dir: 'dist',
                    name: 'code-tests.umd.js',
                    entryFileNames: 'code-tests.umd.js',
                    format: 'umd',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'code-tests.umd.min.js',
                    name: 'code-tests.umd.min.js',
                    format: 'umd',
                    plugins: [terser()]
                }
            ]
        }
    },
    plugins: [dts({ exclude: ["**/*.test.ts", 'src/dev'], rollupTypes: true })]
});