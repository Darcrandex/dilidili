/**
 * @name App
 * @description
 * @author darcrand
 */

import { EChannel, EStorage } from '@electron/enums'
import { useEffect, useState } from 'react'
import { mediaService } from './services/media'

export default function App() {
  useEffect(() => {
    console.log('App')
    window.ipcRenderer.invoke(EChannel.Debug).then((res: any) => {
      console.table(res)
    })
  }, [])

  const [s, setS] = useState('')
  const [bvid, setBvid] = useState('')
  const [info, setInfo] = useState<MainProcess.VideoInfoSchema>()
  const [p, setP] = useState<MainProcess.PageInfoSchema>()

  const login = async () => {
    const res = await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.Session]: s })
  }

  const getInfo = async () => {
    const res = await mediaService.info(bvid)
    console.log('info', res)
    setInfo(res.data)
  }

  const getPlayurl = async () => {
    const cid = info?.pages[0]?.cid || 0
    const res = await mediaService.playurl(bvid, cid)
    console.log('playurl', res)

    setP(res.data)
  }

  const onDownload = async () => {
    const v = p?.dash?.video[0]?.baseUrl
    const a = p?.dash?.audio[0]?.baseUrl

    if (v && a) {
      const params: MainProcess.DownloadBVParams = {
        videoDownloadUrl: v,
        audioDownloadUrl: a,
        coverImageUrl: info?.pic || '',
        ownerId: info?.owner?.mid.toString() || '',
        bvid: bvid,
        page: 1,
        quality: 16,
      }

      await window.ipcRenderer.invoke(EChannel.DownloadBV, params)
    }
  }

  return (
    <>
      <h1>App</h1>

      <textarea value={s} onChange={(e) => setS(e.target.value)} className='block border' />

      <input type='text' value={bvid} onChange={(e) => setBvid(e.target.value)} className='block border' />

      <button onClick={login}>登录</button>

      <button onClick={getInfo}>获取信息</button>

      <button onClick={getPlayurl}>分批</button>

      <button onClick={onDownload}>下载</button>
    </>
  )
}
