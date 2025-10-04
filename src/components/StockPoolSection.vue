<template>
  <div class="stock-pool-section">
    <!-- 股票池标题 -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-white">{{ pool.poolName }}</h2>
      <div class="text-neutral-400 text-sm mt-1">
        共 {{ pool.stocks.length }} 只股票
      </div>
    </div>

    <!-- 股票卡片网格 -->
    <div class="grid grid-cols-6 gap-2">
      <StockCard
        v-for="stock in pool.stocks"
        :key="stock.stockCode"
        :stock="stock"
        :signal="stockSignals[stock.stockCode]"
        @copy-stock-code="$emit('copy-stock-code', stock.stockCode)"
      />
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
  }
})

defineEmits(['copy-stock-code'])
</script>

<style scoped>
.stock-pool-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 2rem;
}

.stock-pool-section:last-child {
  border-bottom: none;
}
</style>
