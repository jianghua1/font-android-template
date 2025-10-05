<template>
  <div class="min-h-screen bg-neutral-900 text-white p-4">


    <!-- 股票池分组展示 -->
    <div v-for="pool in stockPools" :key="pool.id">
      <StockPoolSection 
        :pool="pool" 
        :stockSignals="stockSignals"
        @copy-stock-code="copyStockCode"
        @show-detail="showStockDetail"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="stockPools.length === 0" class="text-center py-16">
      <div class="text-neutral-400 text-lg">暂无股票数据</div>
    </div>

    <!-- 股票详情弹窗 -->
    <StockDetailModal
      v-model:visible="showDetailModal"
      :stock="selectedStock"
      @toggle-frozen="toggleStockFrozen"
      @delete-stock="deleteStockFromPool"
      @toggle-remarks="toggleStockRemarks"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StockPoolSection from './components/StockPoolSection.vue'
import StockDetailModal from './components/StockDetailModal.vue'

// 模拟股票数据
const stockPools = ref([
  {
    id: 1,
    poolName: '自选股票池',
    stocks: [
      { stockCode: '000001', stockName: '平安银行', price: 12.34, change: 0.56, frozen: false, hasRemarks: true },
      { stockCode: '000002', stockName: '万科A', price: 18.90, change: -0.23, frozen: false, hasRemarks: false },
      { stockCode: '000858', stockName: '五粮液', price: 156.78, change: 2.34, frozen: false, hasRemarks: true },
      { stockCode: '600036', stockName: '招商银行', price: 32.45, change: -1.12, frozen: true, hasRemarks: false },
      { stockCode: '601318', stockName: '中国平安', price: 45.67, change: 0.89, frozen: false, hasRemarks: false },
      { stockCode: '000333', stockName: '美的集团', price: 56.78, change: 1.23, frozen: false, hasRemarks: true },
    ]
  },
  {
    id: 2,
    poolName: '科技股池',
    stocks: [
      { stockCode: '000063', stockName: '中兴通讯', price: 28.90, change: 0.45, frozen: false, hasRemarks: false },
      { stockCode: '002415', stockName: '海康威视', price: 34.56, change: -0.78, frozen: false, hasRemarks: true },
      { stockCode: '300059', stockName: '东方财富', price: 23.45, change: 1.34, frozen: false, hasRemarks: false },
      { stockCode: '002230', stockName: '科大讯飞', price: 45.67, change: 0.56, frozen: false, hasRemarks: false },
    ]
  },
  {
    id: 3,
    poolName: '医药股池',
    stocks: [
      { stockCode: '600276', stockName: '恒瑞医药', price: 42.34, change: -0.23, frozen: false, hasRemarks: false },
      { stockCode: '000538', stockName: '云南白药', price: 56.78, change: 0.89, frozen: false, hasRemarks: true },
      { stockCode: '600196', stockName: '复星医药', price: 32.45, change: 0.34, frozen: false, hasRemarks: false },
    ]
  }
])

// 模拟信号数据
const stockSignals = ref({
  '000001': 2,   // 绿色
  '000002': 1,   // 蓝色
  '000858': -1,  // 黄色
  '600036': -2,  // 红色
  '601318': 2,   // 绿色
  '000333': 1,   // 蓝色
  '000063': -1,  // 黄色
  '002415': -2,  // 红色
  '300059': 2,   // 绿色
  '002230': 1,   // 蓝色
  '600276': -1,  // 黄色
  '000538': -2,  // 红色
  '600196': 2,   // 绿色
})

// 获取信号颜色类
const getSignalClass = (stockCode) => {
  const signal = stockSignals.value[stockCode]
  if (signal === 2) return 'green'
  if (signal === 1) return 'blue'
  if (signal === -1) return 'yellow'
  if (signal === -2) return 'red'
  return null
}

// 获取背景信号颜色类
const getBackgroundSignalClass = (stock) => {
  const signal = stockSignals.value[stock.stockCode]
  if (signal === 2) return 'green'
  if (signal === 1) return 'blue'
  if (signal === -1) return 'yellow'
  if (signal === -2) return 'red'
  return null
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

// 复制股票代码
const copyStockCode = async (stockCode) => {
  try {
    await navigator.clipboard.writeText(stockCode)
    console.log(`已复制股票代码：${stockCode}`)
  } catch (error) {
    console.error('复制股票代码失败:', error)
  }
}

// 弹窗相关状态
const showDetailModal = ref(false)
const selectedStock = ref(null)

// 显示股票详情弹窗
const showStockDetail = (stock) => {
  selectedStock.value = stock
  showDetailModal.value = true
}

// 切换股票冻结状态
const toggleStockFrozen = (stock) => {
  const pool = stockPools.value.find(p => 
    p.stocks.some(s => s.stockCode === stock.stockCode)
  )
  if (pool) {
    const stockToUpdate = pool.stocks.find(s => s.stockCode === stock.stockCode)
    if (stockToUpdate) {
      stockToUpdate.frozen = !stockToUpdate.frozen
      console.log(`${stock.stockName} ${stockToUpdate.frozen ? '已冻结' : '已解冻'}`)
    }
  }
}

// 从股票池删除股票
const deleteStockFromPool = (stock) => {
  const pool = stockPools.value.find(p => 
    p.stocks.some(s => s.stockCode === stock.stockCode)
  )
  if (pool) {
    const stockIndex = pool.stocks.findIndex(s => s.stockCode === stock.stockCode)
    if (stockIndex !== -1) {
      pool.stocks.splice(stockIndex, 1)
      console.log(`已删除股票：${stock.stockName}`)
      showDetailModal.value = false
    }
  }
}

// 切换股票备注状态
const toggleStockRemarks = (stock) => {
  const pool = stockPools.value.find(p => 
    p.stocks.some(s => s.stockCode === stock.stockCode)
  )
  if (pool) {
    const stockToUpdate = pool.stocks.find(s => s.stockCode === stock.stockCode)
    if (stockToUpdate) {
      stockToUpdate.hasRemarks = !stockToUpdate.hasRemarks
      console.log(`${stock.stockName} ${stockToUpdate.hasRemarks ? '已添加备注' : '已移除备注'}`)
    }
  }
}

onMounted(() => {
  console.log('股票卡片页面已加载')
})
</script>

<style scoped>
/* 这里不需要重复的样式，因为所有样式都在组件中定义了 */
</style>
