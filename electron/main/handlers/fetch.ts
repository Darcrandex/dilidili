import axios, { AxiosRequestConfig } from 'axios'
import { ipcMain } from 'electron'
import UserAgents from 'user-agents'
import { Channel } from '../enums/channel'

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 1000,
})

export function registerFetchHandler() {
  ipcMain.handle(Channel.Fetch, async (_event, config: AxiosRequestConfig) => {
    const { headers } = config

    const mergedHeaders = {
      ...headers,
      'Content-Type': 'application/json',
      'User-Agent': new UserAgents().toString(),
    }

    config.headers = mergedHeaders

    const res = await axiosInstance(config)
    return res.data
  })
}
