/**
 * @name App
 * @description
 * @author darcrand
 */

import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log('App')
    window.ipcRenderer.invoke('get-ffmpeg-path').then((res) => {
      console.log('get-ffmpeg-path', res)
    })
  }, [])

  return (
    <>
      <h1>App</h1>
    </>
  )
}
