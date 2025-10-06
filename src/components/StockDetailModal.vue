<template>
  <div 
    v-if="visible" 
    class="stock-detail-modal fixed inset-0 z-50 flex items-center justify-center"
    @click="closeModal"
  >
    <!-- 遮罩背景 -->
    <div class="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
    
    <!-- 弹窗内容 -->
    <div 
      class="modal-content relative bg-neutral-800 rounded-2xl p-6 w-80 max-w-[90vw] shadow-2xl"
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

      <!-- 股票基本信息 -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-bold text-white mb-1">{{ stock.stockName }}</h3>
        <p class="text-neutral-400 text-sm">{{ stock.stockCode }}</p>
      </div>

      <!-- 数值显示区域 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-neutral-700 rounded-lg p-3 text-center">
          <div class="text-neutral-400 text-xs mb-1">当前价格</div>
          <div :class="getPriceColor(stock.change)" class="text-lg font-semibold">
            {{ stock.price?.toFixed(2) || '--' }}
          </div>
        </div>
        <div class="bg-neutral-700 rounded-lg p-3 text-center">
          <div class="text-neutral-400 text-xs mb-1">涨跌幅</div>
          <div :class="getChangeColor(stock.change)" class="text-lg font-semibold">
            {{ formatChange(stock.change) }}
          </div>
        </div>
      </div>

      <!-- CCI指标显示区域 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- 周线CCI1 -->
        <div class="bg-neutral-700 rounded-lg p-3 text-center">
          <div class="text-neutral-400 text-xs mb-1">周线CCI1</div>
          <div :class="getCCIColorClass(stock.weeklyCCI1)" class="text-lg font-semibold">
            {{ formatCCIValue(stock.weeklyCCI1) }}
          </div>
        </div>
        
        <!-- 2小时线CCI1 -->
        <div class="bg-neutral-700 rounded-lg p-3 text-center">
          <div class="text-neutral-400 text-xs mb-1">2小时线CCI1</div>
          <div :class="getCCIColorClass(cci1)" class="text-lg font-semibold">
            {{ formatCCIValue(cci1) }}
          </div>
        </div>
      </div>

      <!-- 入库时间 -->
      <div class="bg-neutral-700 rounded-lg p-3 text-center mb-4">
        <div class="text-neutral-400 text-xs mb-1">入库时间</div>
        <div class="text-white text-sm font-medium">
          {{ formatEntryTime(stock.entryTime) }}
        </div>
      </div>

      <!-- 入库天数 -->
      <div v-if="stock.theNumberOfDaysFromToday !== null && stock.theNumberOfDaysFromToday !== undefined" 
           class="bg-neutral-700 rounded-lg p-3 text-center mb-6">
        <div class="text-neutral-400 text-xs mb-1">入库天数</div>
        <div class="text-white text-sm font-medium">
          {{ stock.theNumberOfDaysFromToday }} 天
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="space-y-3">
        <!-- 冻结按钮 -->
        <button 
          @click="toggleFrozen"
          :class="[
            'w-full py-3 rounded-lg font-medium transition-all',
            stock.frozen 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-neutral-700 hover:bg-neutral-600 text-white'
          ]"
        >
          {{ stock.frozen ? '解冻' : '冻结' }}
        </button>

        <!-- 删除按钮 -->
        <button 
          @click="deleteStock"
          class="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
        >
          删除
        </button>

        <!-- 备注按钮 -->
        <button 
          v-if="stock.hasRemarks"
          @click="showRemarks"
          class="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all"
        >
          查看备注
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { stockApi } from '../api/stockApi'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Object,
    default: () => ({})
  },
  poolId: {
    type: Number,
    required: true
  },
  cci1: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'toggle-frozen', 'delete-stock', 'toggle-remarks', 'show-remarks'])

// 关闭弹窗
const closeModal = () => {
  emit('update:visible', false)
}

// 切换冻结状态
const toggleFrozen = () => {
  emit('toggle-frozen', props.stock)
}

// 删除股票
const deleteStock = () => {
  emit('delete-stock', props.stock)
}

// 切换备注状态
const toggleRemarks = () => {
  emit('toggle-remarks', props.stock)
}

// 显示备注
const showRemarks = () => {
  emit('show-remarks', props.stock)
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
  if (!change) return '--'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

// 获取CCI颜色类
const getCCIColorClass = (cciValue) => {
  if (cciValue === null || cciValue === undefined) {
    return 'text-neutral-400'
  }
  
  const cci = Number(cciValue)
  // 大于150或小于-150显示警示色
  if (cci > 150 || cci < -150) {
    return 'text-red-400 font-bold'
  } else {
    return 'text-white'
  }
}

// 格式化CCI值显示
const formatCCIValue = (cciValue) => {
  if (cciValue === null || cciValue === undefined) {
    return '--'
  }
  const cci = Number(cciValue)
  return cci.toFixed(0)
}

// 格式化入库时间
const formatEntryTime = (entryTime) => {
  if (!entryTime) return '--'
  
  try {
    const date = new Date(entryTime)
    // 格式化为 yyyy-mm-dd
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('格式化入库时间失败:', error)
    return '--'
  }
}
</script>

<style scoped>
.stock-detail-modal {
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
