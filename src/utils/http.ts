import { EChannel } from '@electron/enums'
import type { AxiosRequestConfig } from 'axios'

export async function http<Data = any>(config: AxiosRequestConfig<Data>) {
  const res: {
    code: number
    data: Data
    message: string
    ttl: number
  } = await window.ipcRenderer.invoke(EChannel.Fetch, config)

  if (res.code !== 0) {
    throw new Error(res.message)
  }

  return res
}
