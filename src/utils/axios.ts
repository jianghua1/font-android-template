import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
class AxiosService {
  private instance: AxiosInstance

  constructor(baseURL: string, timeout: number = 15000) {
    const config: AxiosRequestConfig = {
      baseURL,
      timeout
    }

    this.instance = axios.create(config)

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 从localStorage获取token
        const token = localStorage.getItem('jwt_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }
}

const axiosService = new AxiosService(
  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PREFIX}`
)
export default axiosService.getInstance()
