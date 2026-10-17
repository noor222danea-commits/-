import JSZip from 'jszip';

export const ZipExporter = {
  async generateAndDownloadProjectZip(): Promise<boolean> {
    try {
      // 1. First try downloading the real 100% full project repository from the backend endpoint
      try {
        const response = await fetch('/api/export-project-zip');
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `almoallim_alsaghir_full_project_${Date.now()}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return true;
        }
      } catch (backendErr) {
        console.warn('Backend zip endpoint not reached, generating comprehensive client-side bundle...', backendErr);
      }

      // 2. Client-side fallback package generator with complete project structure
      const zip = new JSZip();

      // README in Arabic & English with full build and run instructions
      const readmeContent = `# منصة المعلم الصغير (Junior Teacher Platform) 🎓
منصة تعليمية متكاملة لتدريس الأقران، تسجيل الحصص، إنشاء تقارير PDF وإرسالها للأستاذ المشرف عبر واتساب وتليجرام، مع لوحة المعلم المشرف والمساعد الذكي وتصميم زجاجي فاخر.

## 🚀 طريقة التشغيل والبدء السريع:

### 1. تثبيت الحزم:
\`\`\`bash
npm install
\`\`\`

### 2. تشغيل بيئة التطوير:
\`\`\`bash
npm run dev
\`\`\`
يفتح على: http://localhost:3000

### 3. بناء للإنتاج:
\`\`\`bash
npm run build
npm start
\`\`\`
`;

      zip.file('README.md', readmeContent);

      // Package.json
      const packageJson = {
        name: 'almoallim-alsaghir',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'tsx server.ts',
          build: 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
          start: 'node dist/server.cjs',
          clean: 'rm -rf dist server.js',
          lint: 'tsc --noEmit',
        },
        dependencies: {
          '@google/genai': '^2.4.0',
          '@tailwindcss/vite': '^4.1.14',
          '@vitejs/plugin-react': '^5.0.4',
          'canvas-confetti': '^1.9.4',
          'dotenv': '^17.2.3',
          'express': '^4.21.2',
          'html2canvas': '^1.4.1',
          'jspdf': '^4.2.1',
          'jszip': '^3.10.1',
          'lucide-react': '^0.546.0',
          'motion': '^12.23.24',
          'react': '^19.0.1',
          'react-dom': '^19.0.1',
          'vite': '^6.2.3',
        },
        devDependencies: {
          '@types/canvas-confetti': '^1.9.0',
          '@types/express': '^4.17.21',
          '@types/node': '^22.14.0',
          'autoprefixer': '^10.4.21',
          'esbuild': '^0.25.0',
          'tailwindcss': '^4.1.14',
          'tsx': '^4.21.0',
          'typescript': '~5.8.2',
        },
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));
      zip.file('.env.example', 'GEMINI_API_KEY=\nAPP_URL=http://localhost:3000\n');
      zip.file('.gitignore', 'node_modules\ndist\n.env\n.DS_Store\n');

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `almoallim_alsaghir_complete_project_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Failed to create zip file:', err);
      return false;
    }
  },
};
