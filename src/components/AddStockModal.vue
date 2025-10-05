<template>
  <div 
    v-if="visible" 
    class="stock-add-modal fixed inset-0 z-50 flex items-center justify-center"
    @click="closeModal"
  >
    <!-- 遮罩背景 -->
    <div class="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
    
    <!-- 弹窗内容 -->
    <div 
      class="modal-content relative bg-neutral-800 rounded-2xl p-4 sm:p-6 w-80 max-w-[calc(100vw-2rem)] sm:max-w-[90vw] shadow-2xl mx-4"
      @click.stop
    >
      <!-- 关闭按钮 -->
      <button 
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-700/80 hover:bg-neutral-600/90 border border-neutral-600/50 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        @click="closeModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 标题 -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-bold text-white mb-1">添加股票</h3>
        <p class="text-neutral-400 text-sm">将股票添加到您的投资组合</p>
      </div>

      <!-- 表单区域 -->
      <div class="space-y-4">
        <!-- 股票代码输入 -->
        <div>
          <label class="block text-neutral-300 text-sm font-medium mb-2">
            股票代码
          </label>
          <input 
            v-model="stockCode" 
            type="text" 
            class="w-full bg-neutral-700 border border-neutral-600/50 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 box-border"
            placeholder="例如：000001"
            @keyup.enter="addStock"
          />
          <p class="text-neutral-500 text-xs mt-1">请输入完整的股票代码</p>
        </div>

        <!-- 买入备注输入 -->
        <div>
          <label class="block text-neutral-300 text-sm font-medium mb-2">
            买入备注 <span class="text-neutral-500 font-normal">（可选）</span>
          </label>
          <textarea 
            v-model="remark" 
            class="w-full bg-neutral-700 border border-neutral-600/50 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none box-border"
            placeholder="请输入买入理由、目标价位等信息..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="space-y-3 mt-6">
        <!-- 取消按钮 -->
        <button 
          @click="closeModal"
          class="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          取消
        </button>

        <!-- 确认按钮 -->
        <button 
          @click="addStock"
          :disabled="!stockCode || loading"
          :class="[
            'w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
            !stockCode || loading
              ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? '添加中...' : '添加股票' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { stockApi } from '../api/stockApi'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  selectedPoolId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'stock-added'])

const stockCode = ref('')
const remark = ref('')
const loading = ref(false)

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const closeModal = () => {
  emit('update:visible', false)
}

const resetForm = () => {
  stockCode.value = ''
  remark.value = ''
  loading.value = false
}

const addStock = async () => {
  if (!stockCode.value) {
    alert('请输入股票代码')
    return
  }

  loading.value = true
  try {
    await stockApi.addStockToPool(
      props.selectedPoolId,
      stockCode.value.trim(),
      remark.value.trim() || undefined
    )
    
    // 添加成功
    alert('股票添加成功！')
    emit('stock-added')
    closeModal()
  } catch (error) {
    console.error('添加股票失败:', error)
    alert(`添加股票失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.stock-add-modal {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideUp 0.3s ease-out;
}

/* 确保输入框不会超出模态框边界 */
.modal-content input,
.modal-content textarea {
  max-width: 100%;
  box-sizing: border-box;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .modal-content {
    width: calc(100vw - 2rem);
    max-width: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
