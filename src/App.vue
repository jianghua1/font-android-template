<template>
  <div class="min-h-screen bg-neutral-900 text-white p-4">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-white">股票卡片视图</h1>
      <p class="text-neutral-400 mt-2">所有股票一览无余</p>
    </div>

    <!-- 股票池分组展示 -->
    <div v-for="pool in stockPools" :key="pool.id" class="mb-8">
      <StockPoolSection 
        :pool="pool" 
        :stockSignals="stockSignals"
        @copy-stock-code="copyStockCode"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="stockPools.length === 0" class="text-center py-16">
      <div class="text-neutral-400 text-lg">暂无股票数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StockPoolSection from './components/StockPoolSection.vue'

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

onMounted(() => {
  console.log('股票卡片页面已加载')
})
</script>

<style scoped>
/* 这里不需要重复的样式，因为所有样式都在组件中定义了 */
</style>
