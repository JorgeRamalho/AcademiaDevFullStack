import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const apiPort = process.env.ACADEMIA_DEVFULLSTACK_API_PORT ?? "4000";
const devIndex = path.join(repoRoot, "index.vite.html");

function devIndexPlugin(): Plugin {
  return {
    name: "academia-dev-index",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (url !== "/" && url !== "/index.html") {
          next();
          return;
        }
        const html = fs.readFileSync(devIndex, "utf8");
        server
          .transformIndexHtml(url, html)
          .then((transformed) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(transformed);
          })
          .catch(next);
      });
    },
  };
}

export default defineConfig({
  root: repoRoot,
  base: "./",
  plugins: [react(), devIndexPlugin()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-client", import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      input: devIndex,
    },
  },
});
