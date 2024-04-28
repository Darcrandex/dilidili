/**
 * @name App
 * @description
 * @author darcrand
 */

import { EChannel } from '@main/enums'
import { useQueryClient } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { ipcActions } from './actions'
import { routes } from './routes'

const router = createHashRouter(routes)

export default function App() {
  useEffect(() => {
    window.electron.ipcRenderer.invoke(EChannel.Debug).then((res: any) => {
      console.log('debug', res)
    })
  }, [])

  const queryClient = useQueryClient()

  useEffect(() => {
    // 监听任务列表更新
    return ipcActions.subscribeTasksStatus(() => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['local-files'] })
    })
  }, [queryClient])

  return (
    <>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
