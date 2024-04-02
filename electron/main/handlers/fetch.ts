import { EChannel, EStorage } from '@electron/enums'
import axios, { AxiosRequestConfig } from 'axios'
import { ipcMain } from 'electron'
import UserAgents from 'user-agents'
import { globalStore } from '../global-store'

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 1000,
})

// 请求函数封装
// 解决渲染进程请求跨域问题
export function registerFetchHandler() {
  ipcMain.handle(EChannel.Fetch, async (_event, config: AxiosRequestConfig) => {
    const { headers } = config

    const mergedHeaders = {
      ...headers,
      'Content-Type': 'application/json',
      'User-Agent': new UserAgents().toString(),
      cookie: `${EStorage.Session}=${globalStore.get(EStorage.Session)}`,
    }

    config.headers = mergedHeaders

    const res = await axiosInstance(config)
    return res.data
  })
}
