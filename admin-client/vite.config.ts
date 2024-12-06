import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables from .env file
    const env = loadEnv(mode, process.cwd(), '');
    console.log('Loaded Environment Variables:', env);

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        preview: {
            port: 5173,
        },
    };
});
