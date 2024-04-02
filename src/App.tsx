/**
 * @name App
 * @description
 * @author darcrand
 */

import { Channel } from '@electron/main/enums/channel'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log('App')
    window.ipcRenderer.invoke(Channel.Debug).then((res: any) => {
      console.table(res)
    })
  }, [])

  return (
    <>
      <h1>App</h1>
    </>
  )
}
