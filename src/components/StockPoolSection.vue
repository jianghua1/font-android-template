<template>
  <div class="stock-pool-section">
    <!-- 股票池标题 -->
    <div class="mb-4 text-center">
      <h2 class="text-xl font-semibold text-white">{{ pool.poolName }}</h2>
   
    </div>

    <!-- 股票卡片网格 -->
    <div class="grid grid-cols-6 gap-1">
      <StockCard
        v-for="stock in pool.stocks"
        :key="stock.stockCode"
        :stock="stock"
        :signal="stock.stockStrengthSignal"
        :edge-signal="stockSignals[stock.stockCode]"
        :has-unread-message="hasUnreadMessage(stock.stockCode)"
        @copy-stock-code="$emit('copy-stock-code', stock.stockCode)"
        @show-detail="$emit('show-detail', stock)"
        @show-strength-message="$emit('show-strength-message', stock)"
      />
      
      <!-- 添加股票按钮 -->
      <div 
        class="add-stock-card"
        @click="$emit('add-stock', pool.id)"
      >
        <div class="add-stock-content">
          <div class="add-icon">+</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StockCard from './StockCard.vue'

defineProps({
  pool: {
    type: Object,
    required: true
  },
  stockSignals: {
    type: Object,
    required: true
  },
  hasUnreadMessage: {
    type: Function,
    required: true
  }
})

defineEmits(['copy-stock-code', 'show-detail', 'add-stock', 'show-strength-message'])
</script>

<style scoped>
.stock-pool-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stock-pool-section:last-child {
  border-bottom: none;
}

/* 添加股票按钮样式 */
.add-stock-card {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 16.666%;
  height: auto;
  min-height: 40px;
  min-width: 40px;
}

.add-stock-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.1);
}

.add-stock-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.add-icon {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.add-stock-card:hover .add-icon {
  color: #3b82f6;
  transform: scale(1.2);
}
</style>
