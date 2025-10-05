<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="header-text">
            <h3 class="modal-title">添加股票</h3>
            <p class="modal-subtitle">将股票添加到您的投资组合</p>
          </div>
        </div>
        <button class="close-button" @click="closeModal">
          <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <div class="input-wrapper">
            <label class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              股票代码
            </label>
            <input 
              v-model="stockCode" 
              type="text" 
              class="form-input" 
              placeholder="例如：000001"
              @keyup.enter="addStock"
            />
            <div class="input-hint">请输入完整的股票代码</div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="input-wrapper">
            <label class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
              买入备注
              <span class="optional-text">（可选）</span>
            </label>
            <textarea 
              v-model="remark" 
              class="form-textarea" 
              placeholder="请输入买入理由、目标价位等信息..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">
          取消
        </button>
        <button 
          class="btn-confirm" 
          @click="addStock"
          :disabled="!stockCode || loading"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? '添加中...' : '添加股票' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { stockApi } from '../api/stockApi'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  selectedPoolId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'stock-added'])

const stockCode = ref('')
const remark = ref('')
const loading = ref(false)

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const closeModal = () => {
  emit('update:visible', false)
}

const resetForm = () => {
  stockCode.value = ''
  remark.value = ''
  loading.value = false
}

const addStock = async () => {
  if (!stockCode.value) {
    alert('请输入股票代码')
    return
  }

  loading.value = true
  try {
    await stockApi.addStockToPool(
      props.selectedPoolId,
      stockCode.value.trim(),
      remark.value.trim() || undefined
    )
    
    // 添加成功
    alert('股票添加成功！')
    emit('stock-added')
    closeModal()
  } catch (error) {
    console.error('添加股票失败:', error)
    alert(`添加股票失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #374151;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #374151;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.icon-wrapper {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.header-text {
  flex: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
}

.close-button {
  background: #374151;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #4b5563;
  transform: scale(1.05);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.close-button:hover .close-icon {
  color: white;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.input-wrapper {
  position: relative;
  padding: 0 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  transition: color 0.2s;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.optional-text {
  color: #6b7280;
  font-weight: 400;
}

.form-input,
.form-textarea {
  width: 100%;
  background: #111827;
  border: 2px solid #374151;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #6b7280;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: #1f2937;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.input-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid #374151;
}

.btn-cancel,
.btn-confirm {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  justify-content: center;
}

.btn-cancel {
  background: #374151;
  color: #d1d5db;
  border: 2px solid transparent;
}

.btn-cancel:hover {
  background: #4b5563;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-confirm:disabled {
  background: #374151;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
