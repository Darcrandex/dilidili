/**
 * @name Testing
 * @description
 * @author darcrand
 */

import { useState } from 'react'

export default function Testing() {
  const [videoTemp, setV] = useState('')
  const [audioTemp, setA] = useState('')
  const [outputPath, setU] = useState('')

  const onClick = async () => {
    window.ipcRenderer.invoke('go', { videoTemp, audioTemp, outputPath })
  }

  return (
    <>
      <h1>Testing</h1>

      {/* 直接合并视频 */}
      <input className='block p-2 border w-full' type='text' value={videoTemp} onChange={(e) => setV(e.target.value)} />
      <input className='block p-2 border w-full' type='text' value={audioTemp} onChange={(e) => setA(e.target.value)} />
      <input
        className='block p-2 border w-full'
        type='text'
        value={outputPath}
        onChange={(e) => setU(e.target.value)}
      />

      <button onClick={onClick}>go</button>
    </>
  )
}
