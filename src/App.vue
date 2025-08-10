<template>
  <!-- Vue 模板必须有唯一根元素 -->
  <div id="app" class="min-h-screen bg-gray-50 p-6">
    <!-- 标题区域 -->
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-green-600 mb-2">股票消息盒</h1>
      <p class="text-gray-600">Vite + Vue + UnoCSS 项目示例</p>
    </header>

    <!-- 图标展示区域 -->
    <div class="flex justify-center gap-8 my-10">
      <div class="text-center">
        <div class="text-4xl text-red-500 mb-2">
          <i class="i-mdi-home"></i> <!-- 首页图标 -->
        </div>
        <span class="text-sm text-gray-500">首页</span>
      </div>

      <div class="text-center">
        <div class="text-4xl text-blue-500 mb-2">
          <i class="i-fa-user"></i> <!-- 用户图标 -->
        </div>
        <span class="text-sm text-gray-500">个人中心</span>
      </div>

      <div class="text-center">
        <div class="text-4xl text-purple-500 mb-2 hover:rotate-12 transition-transform">
          <i class="i-mdi-settings"></i> <!-- 设置图标 -->
        </div>
        <span class="text-sm text-gray-500">设置</span>
      </div>
    </div>

    <!-- 内容区域（可自定义） -->
    <main class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">消息列表</h2>
      <p class="text-gray-600">这里可以添加你的业务内容...</p>
    </main>

    <!-- 底部区域 -->
    <footer class="text-center text-gray-400 text-sm mt-10">
      © 2025 股票消息盒 | 基于 Vite 和 Vue 构建
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  // 可添加组件逻辑（如数据、方法等）
  data() {
    return {
      // 示例：消息列表数据
      messages: [
        { id: 1, content: '今日股市行情更新', time: '10:30' },
        { id: 2, content: '个股公告提醒', time: '09:15' }
      ]
    };
  }
};
</script>

<style scoped>
/* 可选：添加组件内样式（scoped 表示仅作用于当前组件） */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>