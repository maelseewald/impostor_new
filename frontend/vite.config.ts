import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/api": "http://localhost:9769",
      "/socket.io": {
        target: "ws://localhost:6861",
        ws: true,
      }
    }
  },
});
