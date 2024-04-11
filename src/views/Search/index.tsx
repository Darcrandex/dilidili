/**
 * @name Search
 * @description
 * @author darcrand
 */

import { mediaService } from '@/services/media'
import { useSession } from '@/stores/session'
import { useVideoSearch } from '@/stores/video-search'
import { DownloadOutlined } from '@ant-design/icons'
import { EChannel } from '@electron/enums'
import { useQuery } from '@tanstack/react-query'
import { Button, Input } from 'antd'
import qs from 'qs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DownloadModal from './DownloadModal'

export default function Search() {
  const navigate = useNavigate()
  const [session] = useSession()
  const [{ text }, setState] = useVideoSearch()

  const bvid = useMemo(() => {
    const regex = /\/video\/(BV[0-9a-zA-Z]+)/
    const match = text.match(regex)
    return match?.[1] || ''
  }, [text])

  const p = useMemo(() => {
    const query = text?.split('?')?.[1]
    const params = qs.parse(query)
    return Number.parseInt((params?.p as string) || '1')
  }, [text])

  const { data: videoInfo } = useQuery({
    queryKey: ['video', text],
    enabled: !!bvid,
    queryFn: () => mediaService.info(bvid),
  })

  const iframeUrl = bvid ? `https://player.bilibili.com/player.html?bvid=${bvid}&page=${p}` : ''

  return (
    <>
      <section className='w-144 max-w-full mx-auto my-4 space-y-4'>
        <Input.Search
          placeholder='输入视频地址以搜索'
          enterButton
          defaultValue={text}
          allowClear
          onSearch={(v) => setState({ text: v })}
        />

        {!!videoInfo && (
          <>
            <article className='flex items-center'>
              <img
                src={videoInfo.owner.face}
                alt=''
                referrerPolicy='no-referrer'
                className='block w-14 h-14 mr-2 rounded-full border border-white'
              />

              <div>
                <p
                  onClick={() =>
                    window.ipcRenderer.invoke(
                      EChannel.OpenInBrowser,
                      `https://space.bilibili.com/${videoInfo.owner.mid}`,
                    )
                  }
                  className='truncate text-primary cursor-pointer transition-colors hover:opacity-80'
                >
                  {videoInfo.owner.name}
                </p>
                <p>MID: {videoInfo.owner.mid}</p>
              </div>
            </article>

            <h2>{videoInfo.title}</h2>

            <img src={videoInfo.pic} alt='' referrerPolicy='no-referrer' className='hidden w-full rounded-lg' />

            <iframe src={iframeUrl} className='block w-full h-80 rounded-md overflow-hidden' />

            <p className='text-center'>
              <DownloadModal
                videoInfo={videoInfo}
                defaultPage={p}
                trigger={(onOpen) => (
                  <Button size='large' type='primary' icon={<DownloadOutlined />} onClick={onOpen}>
                    下载视频
                  </Button>
                )}
              />
            </p>

            {!session && (
              <p className='text-center'>
                <Button type='link' onClick={() => navigate('/mine', { replace: true })}>
                  登录
                </Button>
                <span>后可以下载 720P 以上的视频哦</span>
              </p>
            )}
          </>
        )}
      </section>
    </>
  )
}