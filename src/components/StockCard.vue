<template>
  <div 
    class="stock-card rounded-lg relative overflow-hidden cursor-pointer"
    :class="[
      getBackgroundClass(),
      getBorderClass(),
      { 'sell-wanted-poster': props.edgeSignal === -2 },
      { 'copy-highlight': isCopying }
    ]"
    @click="$emit('show-detail', stock)"
    @mousedown="startLongPress"
    @mouseup="cancelLongPress"
    @touchstart="startLongPress"
    @touchend="cancelLongPress"
    @mouseleave="cancelLongPress"
  >
    <!-- 信号竖线动画 -->
    <div 
      v-if="props.edgeSignal === -2 || props.edgeSignal === -1" 
      :class="props.edgeSignal === -2 ? 'signal-line-red' : 'signal-line-yellow'"
    ></div>

    <!-- 股票信息内容 -->
    <div class="stock-content flex flex-col items-center justify-center z-10 relative">
      <!-- 股票名称 - 竖排文字 -->
      <div class="vertical-text text-xs text-white/90 leading-none mt-1">
        {{ stock.stockName.slice(0, 2) }}
      </div>
      
      <!-- 备注标记 -->
      <div 
        v-if="stock.hasRemarks" 
        class="remarks-indicator absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-sm"
      ></div>

      <!-- 冻结标记 -->
      <div 
        v-if="stock.frozen" 
        class="frozen-indicator absolute top-1 left-1 w-1.5 h-1.5 bg-blue-400 rounded-sm"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  },
  signal: {
    type: Number,
    default: 0
  },
  edgeSignal: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['copy-stock-code', 'show-detail'])

const isCopying = ref(false)
const longPressTimer = ref(null)

// 开始长按
const startLongPress = () => {
  isCopying.value = true
  longPressTimer.value = setTimeout(() => {
    emit('copy-stock-code', props.stock.stockCode)
    // 复制完成后重置状态
    setTimeout(() => {
      isCopying.value = false
    }, 300)
  }, 800) // 800ms长按时间
}

// 取消长按
const cancelLongPress = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  isCopying.value = false
}

// 获取背景颜色类
const getBackgroundClass = () => {
  switch (props.signal) {
    case 2: return 'signal-bg-green'
    case 1: return 'signal-bg-blue'
    case -1: return 'signal-bg-yellow'
    case -2: return 'signal-bg-red'
    default: return ''
  }
}

// 获取边框颜色类
const getBorderClass = () => {
  switch (props.edgeSignal) {
    case 2: return 'signal-border-green'
    case 1: return 'signal-border-blue'
    case -1: return 'signal-border-yellow'
    case -2: return 'signal-border-red'
    default: return ''
  }
}

// 获取价格颜色
const getPriceColor = (change) => {
  if (!change) return 'text-white'
  return change >= 0 ? 'text-green-400' : 'text-red-400'
}

// 获取涨跌幅颜色
const getChangeColor = (change) => {
  if (!change) return 'text-neutral-400'
  return change >= 0 ? 'text-green-400' : 'text-red-400'
}

// 格式化涨跌幅
const formatChange = (change) => {
  if (!change) return ''
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}
</script>

<style scoped>
.stock-card {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  width: calc(16.666% - 8px); /* 屏幕宽度的六分之一减去间隙 */
  height: auto;
  min-height: 40px;
  max-height: 55px;
  min-width: 40px;
  max-width: 55px;
}

.stock-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.stock-content {
  padding: 0.5rem;
}

.price-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

/* 信号竖线动画 */
.signal-line-red,
.signal-line-yellow {
  position: absolute;
  top: 0;
  width: 12px;
  height: 100%;
  animation: slideLine 2s infinite ease-in-out;
  z-index: 5;
  filter: brightness(1.2);
  border-radius: 0;
}

.signal-line-red {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, #ef4444 50%, rgba(239, 68, 68, 0.2) 100%);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.signal-line-yellow {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, #f59e0b 50%, rgba(245, 158, 11, 0.2) 100%);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

@keyframes slideLine {
  0% {
    left: -12px;
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: calc(100% + 12px);
    opacity: 0.5;
  }
}

/* 信号背景颜色样式 */
.signal-bg-green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.7) 0%, rgba(4, 120, 87, 0.7) 100%) !important;
}

.signal-bg-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(29, 78, 216, 0.7) 100%) !important;
}

.signal-bg-yellow {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.7) 0%, rgba(217, 119, 6, 0.7) 100%) !important;
}

.signal-bg-red {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.7) 0%, rgba(220, 38, 38, 0.7) 100%) !important;
}

/* 信号边框样式 - 圆形呼吸效果 */
.signal-border-green {
  border: 6px solid #10b981 !important;
  z-index: 10;
  animation: borderPulseGreen 2s infinite ease-in-out;
}

.signal-border-blue {
  border: 6px solid #3b82f6 !important;
  z-index: 10;
  animation: borderPulseBlue 2s infinite ease-in-out;
}

.signal-border-yellow {
  border: 6px solid #f59e0b !important;
  z-index: 10;
  animation: borderBlinkYellow 0.6s infinite ease-in-out;
}

.signal-border-red {
  border: 6px solid #ef4444 !important;
  z-index: 10;
  animation: borderBlinkRed 0.6s infinite ease-in-out;
}

/* 绿色和蓝色边框的呼吸效果 */
@keyframes borderPulseGreen {
  0% {
    border-color: #10b981;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  }
  50% {
    border-color: #059669;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
  }
  100% {
    border-color: #10b981;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  }
}

@keyframes borderPulseBlue {
  0% {
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  50% {
    border-color: #2563eb;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
  100% {
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
}

/* 黄色和红色边框的闪烁效果 */
@keyframes borderBlinkYellow {
  0% {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
  25% {
    border-color: #d97706;
    transform: scale(1.08);
  }
  50% {
    border-color: #b45309;
    transform: scale(1.1);
  }
  75% {
    border-color: #d97706;
    transform: scale(1.08);
  }
  100% {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
}

@keyframes borderBlinkRed {
  0% {
    border-color: #ef4444;
    transform: scale(1.05);
  }
  25% {
    border-color: #dc2626;
    transform: scale(1.08);
  }
  50% {
    border-color: #b91c1c;
    transform: scale(1.1);
  }
  75% {
    border-color: #dc2626;
    transform: scale(1.08);
  }
  100% {
    border-color: #ef4444;
    transform: scale(1.05);
  }
}

/* 中文竖排文字样式 */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: inline-block;
  white-space: nowrap;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-align: center;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 长按复制时的视觉反馈 */
.copy-highlight {
  animation: copyPulse 0.8s ease-in-out;
  border-color: rgba(59, 130, 246, 0.8) !important;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6) !important;
  background: rgba(59, 130, 246, 0.3) !important;
}

@keyframes copyPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
  }
}

/* 通缉令效果的卖标记 */
.sell-wanted-poster {
  animation: wantedPulse 2s infinite ease-in-out;
  backdrop-filter: blur(1px);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  border: 2px dashed rgba(255, 255, 255, 0.7);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  background-color: rgba(239, 68, 68, 0.6) !important;
}

@keyframes wantedPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
    border-color: #fff;
  }
  25% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
    border-color: #fca5a5;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(239, 68, 68, 1);
    border-color: #f87171;
  }
  75% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
    border-color: #fca5a5;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
    border-color: #fff;
  }
}
</style>
