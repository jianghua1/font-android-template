<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 股票信息头部 -->
      <div class="stock-header">
        <div class="stock-info">
          <div class="stock-name">{{ stock?.stockName }}</div>
          <div class="stock-code">{{ stock?.stockCode }}</div>
        </div>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <!-- 消息内容区域 -->
      <div class="message-area">
        <div class="message-title">转强消息</div>
        <div class="message-text">{{ message }}</div>
        <div class="message-time" v-if="messageTime">{{ messageTime }}</div>
      </div>
      
      <!-- 底部操作按钮 -->
      <div class="action-area">
        <button class="confirm-button" @click="closeModal">知道了</button>
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

const closeModal = () => {
  emit('update:visible', false)
}

// 监听visible变化，防止背景滚动
watch(() => props.visible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(59, 130, 246, 0.95);
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  overflow: hidden;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stock-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.stock-code {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.message-area {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  word-break: break-word;
  text-align: center;
}

.message-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.action-area {
  padding: 16px 20px 20px;
  display: flex;
  justify-content: center;
}

.confirm-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 32px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.confirm-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
</style>
