<template>
  <div 
    v-if="visible" 
    class="remarks-modal fixed inset-0 z-50 flex items-center justify-center"
    @click="closeModal"
  >
    <!-- 遮罩背景 -->
    <div class="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
    
    <!-- 弹窗内容 -->
    <div 
      class="modal-content relative bg-neutral-800 rounded-2xl p-6 w-80 max-w-[90vw] shadow-2xl"
      @click.stop
    >
      <!-- 标题和关闭按钮 -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-left">
          <h3 class="text-xl font-bold text-white mb-1">股票备注</h3>
          <p class="text-neutral-400 text-sm">{{ stockName }}</p>
        </div>
        <button 
          class="w-8 h-8 flex items-center justify-center bg-neutral-700/80 hover:bg-neutral-600/90 border border-neutral-600/50 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          @click="closeModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 备注内容 -->
      <div class="bg-neutral-700 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-2">
          <div class="text-neutral-400 text-xs">备注内容</div>
          <div v-if="createTime" class="text-neutral-500 text-xs">
            创建时间: {{ formatCreateTime(createTime) }}
          </div>
        </div>
        <div class="text-white text-sm leading-relaxed whitespace-pre-wrap">
          {{ remarks || '暂无备注信息' }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  stockName: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  createTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible'])

// 关闭弹窗
const closeModal = () => {
  emit('update:visible', false)
}

// 格式化创建时间
const formatCreateTime = (timeString) => {
  if (!timeString) return ''
  
  try {
    const date = new Date(timeString)
    // 格式化为 yyyy-mm-dd
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('时间格式化错误:', error)
    return timeString
  }
}
</script>

<style scoped>
.remarks-modal {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideUp 0.3s ease-out;
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
