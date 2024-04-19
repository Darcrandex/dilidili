/**
 * @name App
 * @description
 * @author darcrand
 */

import { EChannel } from '@electron/enums'
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

  return (
    <>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
