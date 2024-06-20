import axios, { type AxiosError } from 'axios'
import axiosTauriApiAdapter from 'axios-tauri-api-adapter'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  adapter: axiosTauriApiAdapter,
})

client.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    console.error(err)
  },
)

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err: AxiosError) => {
    return Promise.reject(err.response?.data)
  },
)

export default client
