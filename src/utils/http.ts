import { HandleChannel } from '@electron/enums'
import { AxiosRequestConfig } from 'axios'

export async function http<Data = any>(config: AxiosRequestConfig<Data>) {
  // bilibili接口返回的格式
  const res: {
    code: number
    data: Data
    message: string
    ttl: number
  } = await window.ipcRenderer.invoke(HandleChannel.Fetch, config)

  if (res.code !== 0) {
    throw new Error(res.message)
  }

  return res
}
