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
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }
}

const axiosService = new AxiosService(
  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PREFIX}`
)
export default axiosService.getInstance()
