/**
 * @name SearchVideo
 * @description
 * @author darcrand
 */

import logoImage from '@/assets/logos/dilidili-logo1@0.5x.png'
import { mediaService } from '@/services/media'
import { useSession } from '@/stores/session'
import { useVideoSearch } from '@/stores/video-search'
import { cls } from '@/utils/cls'
import { DownloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useSize } from 'ahooks'
import { Button, Input } from 'antd'
import qs from 'qs'
import { isNotNil } from 'ramda'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DownloadModal from './DownloadModal'

export default function SearchVideo() {
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
    queryKey: ['video', 'info', bvid, text],
    enabled: !!bvid,
    queryFn: () => mediaService.info(bvid),
  })

  // layout
  const winSize = useSize(() => window.document.body)

  return (
    <>
      <div className='max-w-xl mx-auto p-4'>
        <section className='mb-4 space-y-4'>
          <div className='max-w-sm mx-auto'>
            <img
              src={logoImage}
              alt=''
              className={cls('block w-auto h-20 mx-auto mb-12', isNotNil(videoInfo) && 'hidden')}
              style={{ transform: `translateY(${0.2 * (winSize?.height || 768)}px)` }}
            />

            <Input.Search
              placeholder='输入视频地址看看吧  ≖‿≖✧'
              enterButton
              defaultValue={text}
              allowClear
              autoFocus
              size='large'
              onSearch={(v) => setState({ text: v })}
              style={{ transform: `translateY(${isNotNil(videoInfo) ? 0 : 0.2 * (winSize?.height || 768)}px)` }}
            />
          </div>

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
                  <p className='text-sm cursor-pointer transition-colors hover:opacity-80'>{videoInfo.owner.name}</p>
                  <p className='text-sm text-gray-500'>MID: {videoInfo.owner.mid}</p>
                </div>
              </article>

              <h2 className='font-bold'>{videoInfo.title}</h2>

              <img
                src={videoInfo.pic}
                alt=''
                referrerPolicy='no-referrer'
                className='block w-full h-80 lg:h-96 rounded-lg bg-black object-contain'
              />

              <p className='text-center'>
                <DownloadModal
                  videoInfo={videoInfo}
                  defaultPage={p}
                  trigger={(onOpen) => (
                    <Button type='primary' icon={<DownloadOutlined />} onClick={onOpen}>
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
      </div>
    </>
  )
}
