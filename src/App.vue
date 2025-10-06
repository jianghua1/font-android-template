<template>
  <div class="min-h-screen bg-neutral-900 text-white p-4">


    <!-- 股票池分组展示 -->
    <div v-for="pool in stockPools" :key="pool.id">
      <StockPoolSection 
        :pool="pool" 
        :stockSignals="stockSignals"
        @copy-stock-code="copyStockCode"
        @show-detail="showStockDetail"
        @add-stock="handleAddStock"
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
      :poolId="getPoolIdForStock(selectedStock)"
      :cci1="getCCI1ForStock(selectedStock)"
      @toggle-frozen="toggleStockFrozen"
      @delete-stock="deleteStockFromPool"
      @toggle-remarks="toggleStockRemarks"
      @show-remarks="getStockRemarks"
    />

    <!-- 添加股票弹窗 -->
    <AddStockModal
      v-model:visible="showAddStockModal"
      :stock-pools="stockPools"
      :selected-pool-id="selectedPoolIdForAdd"
      @stock-added="handleStockAdded"
    />

    <!-- 备注弹窗 -->
    <RemarksModal
      v-model:visible="showRemarksModal"
      :stockName="selectedStock?.stockName || ''"
      :remarks="currentRemarks"
      :createTime="currentRemarksCreateTime"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StockPoolSection from './components/StockPoolSection.vue'
import StockDetailModal from './components/StockDetailModal.vue'
import AddStockModal from './components/AddStockModal.vue'
import RemarksModal from './components/RemarksModal.vue'
import { stockApi } from './api/stockApi'

// 股票池数据
const stockPools = ref([])

// 信号数据（使用实际的stockStrengthSignal）
const stockSignals = ref({})

// 120分钟级别实时指标数据
const stock120MinIndicators = ref({})

// 我的持仓股票池ID
const myHoldingPoolId = ref(null)

// 定时器引用
let intervalId = null

// 获取信号颜色类
const getSignalClass = (stockCode) => {
  const signal = stockSignals.value[stockCode]
  if (signal === 2) return 'green'
  if (signal === 1) return 'blue'
  if (signal === -1) return 'yellow'
  if (signal === -2) return 'red'
  return null
}

// 获取背景信号颜色类（使用实际的stockStrengthSignal）
const getBackgroundSignalClass = (stock) => {
  const signal = stock.stockStrengthSignal
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

// 添加股票相关状态
const showAddStockModal = ref(false)
const selectedPoolIdForAdd = ref(null)

// 获取股票的poolId
const getPoolIdForStock = (stock) => {
  if (!stock) return null
  const pool = stockPools.value.find(p => 
    p.stocks.some(s => s.stockCode === stock.stockCode)
  )
  return pool ? pool.id : null
}

// 获取股票的120分钟级别CCI1值
const getCCI1ForStock = (stock) => {
  if (!stock || !stock.stockCode) return null
  const indicator = stock120MinIndicators.value[stock.stockCode]
  return indicator ? indicator.cci1 : null
}

// 显示股票详情弹窗
const showStockDetail = (stock) => {
  selectedStock.value = stock
  showDetailModal.value = true
}

// 切换股票冻结状态
const toggleStockFrozen = async (stock) => {
  try {
    const pool = stockPools.value.find(p => 
      p.stocks.some(s => s.stockCode === stock.stockCode)
    )
    if (pool) {
      const stockToUpdate = pool.stocks.find(s => s.stockCode === stock.stockCode)
      if (stockToUpdate) {
        if (stockToUpdate.frozen) {
          // 解冻股票
          await stockApi.unfreezeStock(stock.stockCode)
        } else {
          // 冻结股票
          await stockApi.freezeStock(stock.stockCode)
        }
        
        // 更新前端状态
        stockToUpdate.frozen = !stockToUpdate.frozen
        console.log(`${stock.stockName} ${stockToUpdate.frozen ? '已冻结' : '已解冻'}`)
      }
    }
  } catch (error) {
    console.error('切换股票冻结状态失败:', error)
  }
}

// 从股票池删除股票
const deleteStockFromPool = async (stock) => {
  try {
    const pool = stockPools.value.find(p => 
      p.stocks.some(s => s.stockCode === stock.stockCode)
    )
    if (pool) {
      // 调用API删除股票
      await stockApi.removeStockFromPool(pool.id, stock.stockCode)
      
      // 更新前端状态
      const stockIndex = pool.stocks.findIndex(s => s.stockCode === stock.stockCode)
      if (stockIndex !== -1) {
        pool.stocks.splice(stockIndex, 1)
        console.log(`已删除股票：${stock.stockName}`)
        showDetailModal.value = false
      }
    }
  } catch (error) {
    console.error('删除股票失败:', error)
  }
}

// 备注相关状态
const stockRemarks = ref({})
const showRemarksModal = ref(false)
const currentRemarks = ref('')
const currentRemarksCreateTime = ref('')

// 获取股票备注信息
const getStockRemarks = async (stock) => {
  try {
    if (stock.hasRemarks) {
      // 使用更新后的API方法获取完整的备注信息（包含remarks和createTime）
      const remarksData = await stockApi.getStockRemarks(stock.stockCode)
      stockRemarks.value[stock.stockCode] = remarksData.remarks
      currentRemarks.value = remarksData.remarks
      currentRemarksCreateTime.value = remarksData.createTime
      
      showRemarksModal.value = true
    }
  } catch (error) {
    console.error(`获取股票 ${stock.stockCode} 的备注信息失败:`, error)
    currentRemarks.value = '获取备注信息失败'
    currentRemarksCreateTime.value = ''
    showRemarksModal.value = true
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

// 处理添加股票事件
const handleAddStock = (poolId) => {
  selectedPoolIdForAdd.value = poolId
  showAddStockModal.value = true
}

// 处理股票添加成功
const handleStockAdded = () => {
  console.log('股票添加成功，重新加载数据...')
  loadStockPools()
}

// 加载120分钟级别实时指标数据
const load120MinIndicators = async () => {
  try {
    console.log('开始加载120分钟级别指标数据...')
    
    // 为每个股票池加载120分钟级别指标
    for (const pool of stockPools.value) {
      try {
        const indicators = await stockApi.get120MinIndicators(pool.id)
        console.log(`股票池 ${pool.poolName} 的120分钟级别指标:`, indicators)
        
        // 更新120分钟级别指标数据
        indicators.forEach(indicator => {
          stock120MinIndicators.value[indicator.stockCode] = {
            stockStrengthSignal: parseInt(indicator.stockStrengthSignal),
            cci1: parseFloat(indicator.cci1)
          }
        })
        
        // 更新股票池中的股票数据，保持原有信号不变，只更新120分钟级别信号
        pool.stocks.forEach(stock => {
          const indicator = stock120MinIndicators.value[stock.stockCode]
          if (indicator) {
            // 更新120分钟级别信号到stockSignals，用于边框颜色和动画
            stockSignals.value[stock.stockCode] = indicator.stockStrengthSignal
            console.log(`更新股票 ${stock.stockCode} 的120分钟级别信号为: ${indicator.stockStrengthSignal}`)
          }
        })
        
      } catch (error) {
        console.error(`加载股票池 ${pool.poolName} 的120分钟级别指标失败:`, error)
      }
    }
    
    console.log('120分钟级别指标数据更新完成:', stock120MinIndicators.value)
    
  } catch (error) {
    console.error('加载120分钟级别指标数据失败:', error)
  }
}

// 加载我的持仓股票池ID
const loadMyHoldingPool = async () => {
  try {
    console.log('开始加载我的持仓股票池ID...')
    const holdingPoolId = await stockApi.getMyHoldingPoolId()
    console.log('获取到我的持仓股票池ID:', holdingPoolId)
    
    if (holdingPoolId) {
      myHoldingPoolId.value = holdingPoolId
      console.log('我的持仓股票池ID:', myHoldingPoolId.value)
    } else {
      console.log('没有找到我的持仓股票池')
      myHoldingPoolId.value = null
    }
  } catch (error) {
    console.error('加载我的持仓股票池ID失败:', error)
    myHoldingPoolId.value = null
  }
}

// 加载股票池数据
const loadStockPools = async () => {
  try {
    console.log('开始加载股票池数据...')
    
    // 先加载我的持仓股票池
    await loadMyHoldingPool()
    
    const pools = await stockApi.getStockPools()
    console.log('获取到股票池:', pools)
    
    // 为每个股票池加载股票数据
    const poolsWithStocks = await Promise.all(
      pools.map(async (pool) => {
        try {
          const stocks = await stockApi.getStocksByPoolId(pool.id)
          console.log(`股票池 ${pool.poolName} 的股票数据:`, stocks)
          
          // 转换股票数据格式以匹配现有组件
          const formattedStocks = stocks.map(stock => ({
            stockCode: stock.stockCode,
            stockName: stock.stockName,
            price: 0, // 暂时设为0，后续可以添加价格接口
            change: 0, // 暂时设为0，后续可以添加涨跌幅接口
            frozen: stock.frozen,
            hasRemarks: stock.hasRemarks,
            theNumberOfDaysFromToday: stock.theNumberOfDaysFromToday,
            stockStrengthSignal: stock.stockStrengthSignal,
            weeklyCCI1: stock.weeklyCCI1,
            entryTime: stock.entryTime, // 添加入库时间字段
            // 添加是否在持仓股票池中的标记
            isInHoldingPool: myHoldingPoolId.value === pool.id
          }))
          
          return {
            id: pool.id,
            poolName: pool.poolName,
            stocks: formattedStocks
          }
        } catch (error) {
          console.error(`加载股票池 ${pool.poolName} 的股票数据失败:`, error)
          return {
            id: pool.id,
            poolName: pool.poolName,
            stocks: []
          }
        }
      })
    )
    
    stockPools.value = poolsWithStocks
    console.log('最终股票池数据:', stockPools.value)
    
    // 加载120分钟级别指标数据
    await load120MinIndicators()
    
  } catch (error) {
    console.error('加载股票池数据失败:', error)
  }
}

// 启动定时器，每分钟更新一次120分钟级别数据
const start120MinUpdateTimer = () => {
  intervalId = setInterval(async () => {
    console.log('定时更新120分钟级别指标数据...')
    await load120MinIndicators()
  }, 60000) // 1分钟
}

onMounted(() => {
  console.log('股票卡片页面已加载')
  loadStockPools()
  start120MinUpdateTimer()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<style scoped>
/* 这里不需要重复的样式，因为所有样式都在组件中定义了 */
</style>
