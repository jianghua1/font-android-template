<template>
  <div 
    v-if="visible" 
    class="message-bubble fixed top-4 left-4 right-4 z-50 animate-fade-in-down"
  >
    <div class="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg w-full">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex flex-col">
          <span class="font-medium">{{ stock?.stockName }} ({{ stock?.stockCode }})</span>
          <span class="text-sm opacity-90">{{ message }}</span>
          <span class="text-xs opacity-70 mt-1" v-if="messageTime">{{ messageTime }}</span>
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
  stock: {
    type: Object,
    default: null
  },
  message: {
    type: String,
    default: ''
  },
  messageTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible'])

const closeBubble = () => {
  emit('update:visible', false)
}

// 自动关闭定时器
let autoCloseTimer = null

// 监听visible变化，设置自动关闭
watch(() => props.visible, (newValue) => {
  if (newValue) {
    // 清除之前的定时器
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
    // 设置5秒后自动关闭
    autoCloseTimer = setTimeout(() => {
      closeBubble()
    }, 5000)
  } else {
    // 清除定时器
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})
</script>

<style scoped>
.message-bubble {
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
