import axiosInstance from '../utils/axios'

// 股票池接口响应类型
export interface StockPool {
  id: number
  poolName: string
  createTime: string
  description: string
  enabled: boolean
  priority: number
  showDateDisplay: boolean
  myHolding: boolean
}

export interface StockPoolResponse {
  code: number
  message: string
  data: StockPool[]
}

// 股票信息接口响应类型
export interface StockInfo {
  id: number
  poolId: number
  stockCode: string
  position: number
  entryTime: string
  stockName: string
  buyPointDate: string | null
  theNumberOfDaysFromToday: number | null
  stockStrengthSignal: number
  weeklyCCI1: number
  frozen: boolean
  hasRemarks: boolean
}

export interface StockInfoResponse {
  code: number
  message: string
  data: StockInfo[]
}

// 120分钟级别实时指标接口响应类型
export interface Stock120MinIndicator {
  stockCode: string
  stockStrengthSignal: string
  cci1: string
}

export interface Stock120MinIndicatorResponse {
  code: number
  message: string
  data: Stock120MinIndicator[]
}

// 添加股票请求类型
export interface AddStockRequest {
  poolId: number
  stockCode: string
  remark?: string
}

export interface AddStockResponse {
  code: number
  message: string
  data: null
}

// 删除股票响应类型
export interface RemoveStockResponse {
  code: number
  message: string
  data: null
}

// 冻结/解冻股票响应类型
export interface FreezeStockResponse {
  code: number
  message: string
  data: null
}

// 备注信息接口响应类型
export interface StockRemarks {
  id: number
  symbol: string
  remarks: string
  createTime: string
}

export interface StockRemarksResponse {
  code: number
  message: string
  data: StockRemarks
}

// API服务
export const stockApi = {
  // 获取股票池列表
  async getStockPools(): Promise<StockPool[]> {
    try {
      const response = await axiosInstance.get<StockPoolResponse>('/stock-pools')
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('获取股票池失败:', error)
      throw error
    }
  },

  // 获取股票池中的股票列表
  async getStocksByPoolId(poolId: number): Promise<StockInfo[]> {
    try {
      const response = await axiosInstance.get<StockInfoResponse>(`/stock-operations/${poolId}/stocks`)
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`获取股票池 ${poolId} 的股票列表失败:`, error)
      throw error
    }
  },

  // 获取120分钟级别实时指标分析
  async get120MinIndicators(poolId: number): Promise<Stock120MinIndicator[]> {
    try {
      const response = await axiosInstance.get<Stock120MinIndicatorResponse>(`/stock-indicators/${poolId}/analyze-120min-indicators`)
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`获取股票池 ${poolId} 的120分钟级别指标失败:`, error)
      throw error
    }
  },

  // 添加股票到股票池
  async addStockToPool(poolId: number, stockCode: string, remark?: string): Promise<void> {
    try {
      const params = new URLSearchParams()
      params.append('stockCode', stockCode)
      if (remark) {
        params.append('remark', remark)
      }
      
      const response = await axiosInstance.post<AddStockResponse>(`/stock-operations/${poolId}/add-stock`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      if (response.data.code === 200) {
        return
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('添加股票失败:', error)
      throw error
    }
  },

  // 从股票池删除股票
  async removeStockFromPool(poolId: number, stockCode: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<RemoveStockResponse>(`/stock-operations/${poolId}/remove-stock`, {
        params: {
          stockCode
        }
      })
      
      if (response.data.code === 200) {
        return
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('删除股票失败:', error)
      throw error
    }
  },

  // 冻结股票
  async freezeStock(symbol: string): Promise<void> {
    try {
      const response = await axiosInstance.post<FreezeStockResponse>(`/stock-operations/freeze/${symbol}`)
      
      if (response.data.code === 200) {
        return
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('冻结股票失败:', error)
      throw error
    }
  },

  // 解冻股票
  async unfreezeStock(symbol: string): Promise<void> {
    try {
      const response = await axiosInstance.post<FreezeStockResponse>(`/stock-operations/unfreeze/${symbol}`)
      
      if (response.data.code === 200) {
        return
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('解冻股票失败:', error)
      throw error
    }
  },

  // 获取我的持仓股票池ID
  async getMyHoldingPoolId(): Promise<number | null> {
    try {
      const response = await axiosInstance.get<{ code: number; message: string; data: number }>('/stock-pools/my-holding')
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('获取我的持仓股票池ID失败:', error)
      throw error
    }
  },

  // 获取股票备注信息
  async getStockRemarks(stockCode: string): Promise<StockRemarks> {
    try {
      const response = await axiosInstance.get<StockRemarksResponse>(`/stock-operations/remarks/${stockCode}`)
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`获取股票 ${stockCode} 的备注信息失败:`, error)
      throw error
    }
  }
}
