// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import UnoCSS from "unocss/vite"; // 导入 UnoCSS Vite 插件

export default defineConfig({
  // 配置 Vue 插件（解析 .vue 文件）
  plugins: [vue(), UnoCSS()],
  // 配置路径别名（如果项目中用了 @ 指代 src，需要同步配置）
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 开发服务器配置（可选，默认端口 5173）
  server: {
    port: 5174, // 可改为你习惯的端口（如原来的 8080）
  },
});
