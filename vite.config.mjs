import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:"/Populus-site/",plugins:[react()],build:{outDir:'dist'}});
