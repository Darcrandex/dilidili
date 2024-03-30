// 由渲染进程触发，但由主进程实际发送请求
// 解决请求跨域问题

import { globalStore } from '@electron/common/global-store'
import { REFERER, SESSION_KEY } from '@electron/const'
import { HandleChannel } from '@electron/enums'
import axios, { type AxiosRequestConfig } from 'axios'
import { ipcMain } from 'electron'
import QueryString from 'qs'
import userAgents from 'user-agents'

const axiosIns = axios.create({
  timeout: 1000 * 60,
  paramsSerializer: {
    serialize: (params) => QueryString.stringify(params, { arrayFormat: 'brackets' }),
  },
})

export async function registerFetchHandler() {
  // bilibili api fetch
  ipcMain.handle(HandleChannel.Fetch, async (_event, config: AxiosRequestConfig) => {
    const { headers, ...rest } = config
    const ua = new userAgents({ deviceCategory: 'desktop' })
    const SESSDATA = globalStore.get(SESSION_KEY)

    const mergedConfig = {
      ...rest,
      headers: {
        ...headers,
        'user-agent': ua.toString(),
        referer: REFERER,
        cookie: `SESSDATA=${SESSDATA}`,
      },
    }

    // 由于 axios 包装的返回体太大，导致无法通过 ipcMain 返回给 ipcRenderer
    // 只返回 data 部分
    const res = await axiosIns.request(mergedConfig)
    const data = res.data
    return data
  })
}
