import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Custom Vite plugin to handle CSV & Studies persistence
const healthVaultDataPlugin = () => ({
  name: 'health-vault-data-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // 1. GET /api/data -> Load all CSVs
      if (req.method === 'GET' && req.url === '/api/data') {
        try {
          const dataDir = path.resolve(process.cwd(), 'data');
          const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
          const payload: Record<string, string> = {};

          for (const file of files) {
            const key = file.replace('.csv', '');
            const filePath = path.join(dataDir, file);
            payload[key] = fs.readFileSync(filePath, 'utf8');
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: payload }));
        } catch (error: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to read data files', details: error.message }));
        }
        return;
      }

      // 2. POST /api/save -> Save CSV content
      if (req.method === 'POST' && req.url === '/api/save') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { fileName, content } = JSON.parse(body);
            if (!fileName || typeof content !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'fileName and content are required' }));
              return;
            }

            // Security: only allow data/ directory
            const safeName = path.basename(fileName);
            const targetPath = path.resolve(process.cwd(), 'data', safeName.endsWith('.csv') ? safeName : `${safeName}.csv`);

            fs.writeFileSync(targetPath, content.trim() + '\n', 'utf8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, file: safeName }));
          } catch (error: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save CSV file', details: error.message }));
          }
        });
        return;
      }

      // 3. GET /api/studies -> List files in studies directories
      if (req.method === 'GET' && req.url === '/api/studies') {
        try {
          const studiesDir = path.resolve(process.cwd(), 'studies');
          const categories = ['MRI', 'Bloodwork', 'Reports'];
          const result: Array<{ category: string; fileName: string; sizeBytes: number; modifiedAt: string }> = [];

          for (const cat of categories) {
            const catPath = path.join(studiesDir, cat);
            if (fs.existsSync(catPath)) {
              const files = fs.readdirSync(catPath).filter(f => !f.startsWith('.'));
              for (const f of files) {
                const filePath = path.join(catPath, f);
                const stats = fs.statSync(filePath);
                result.push({
                  category: cat,
                  fileName: f,
                  sizeBytes: stats.size,
                  modifiedAt: stats.mtime.toISOString(),
                });
              }
            }
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, studies: result }));
        } catch (error: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to scan studies', details: error.message }));
        }
        return;
      }

      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), healthVaultDataPlugin()],
  server: {
    port: 3002,
    host: true,
  },
});
