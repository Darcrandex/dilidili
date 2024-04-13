/**
 * @name App
 * @description
 * @author darcrand
 */

import { EChannel, EStorage } from '@electron/enums'
import { useQueryClient } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { routes } from './routes'

const router = createHashRouter(routes)

export default function App() {
  useEffect(() => {
    window.ipcRenderer.invoke(EChannel.Debug).then((res: any) => {
      console.log('debug', res)
    })
  }, [])

  // 监听 任务列表
  const queryClient = useQueryClient()
  useEffect(() => {
    const listener = (_event: any, key: string) => {
      if (key === EStorage.DownloadTasks) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['local-files', 'bv-tree'] })
      }
    }

    window.ipcRenderer.on(EChannel.StoreUpdated, listener)
    return () => {
      window.ipcRenderer.off(EChannel.StoreUpdated, listener)
    }
  }, [queryClient])

  return (
    <>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
