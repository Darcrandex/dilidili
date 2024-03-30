/**
 * @name App
 * @description
 * @author darcrand
 */

import { useState } from 'react'
import { useSession } from './hooks/useSession'
import { mediaService } from './services/media'

export default function App() {
  const { setSession } = useSession()
  const [data, setData] = useState('')
  const [bvid, setBvid] = useState('')

  const onClick = async () => {
    await setSession(data)
    const info = await mediaService.info(bvid)
    console.log('info', info)
  }

  return (
    <>
      <h1>App</h1>

      <textarea value={data} onChange={(e) => setData(e.target.value)} />

      <input value={bvid} onChange={(e) => setBvid(e.target.value)} />

      <p>{JSON.stringify({ ssid: data, bvid })}</p>

      <button onClick={onClick}>获取视频信息</button>
    </>
  )
}
