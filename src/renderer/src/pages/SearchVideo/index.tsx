/**
 * @name SearchVideo
 * @description
 * @author darcrand
 */

import { DownloadOutlined } from '@ant-design/icons'
import logoImage from '@renderer/assets/logos/dilidili-logo1@0.5x.png'
import { mediaService } from '@renderer/services/media'
import { useSession } from '@renderer/stores/session'
import { useVideoSearch } from '@renderer/stores/video-search'
import UEmpty from '@renderer/ui/UEmpty'
import UImage from '@renderer/ui/UImage'
import { cls } from '@renderer/utils/cls'
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
    return match?.[1]
  }, [text])

  const invalidBVID = !!text.trim() && !bvid

  const p = useMemo(() => {
    const query = text?.split('?')?.[1]
    const params = qs.parse(query)
    return Number.parseInt((params?.p as string) || '1')
  }, [text])

  const { data: videoInfo } = useQuery({
    queryKey: ['video', 'info', bvid, text],
    enabled: !!bvid,
    queryFn: () => mediaService.info(bvid || '')
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
              placeholder='输入视频地址试试看吧  ≖‿≖✧'
              enterButton
              defaultValue={text}
              allowClear
              autoFocus
              size='large'
              onSearch={(v) => setState({ text: v })}
              style={{ transform: `translateY(${isNotNil(videoInfo) ? 0 : 0.2 * (winSize?.height || 768)}px)` }}
            />

            {invalidBVID && (
              <UEmpty
                style={{ transform: `translateY(${isNotNil(videoInfo) ? 0 : 0.2 * (winSize?.height || 768)}px)` }}
              >
                视频地址不对劲
              </UEmpty>
            )}
          </div>

          {!!videoInfo && (
            <>
              <article className='flex items-center'>
                <UImage src={videoInfo.owner.face} fit='cover' className='w-10 h-10 rounded-full' />

                <div className='ml-2'>
                  <p className='text-sm cursor-pointer transition-colors hover:opacity-80'>{videoInfo.owner.name}</p>
                  <p className='text-sm text-gray-500'>MID: {videoInfo.owner.mid}</p>
                </div>
              </article>

              <h2 className='font-bold'>{videoInfo.title}</h2>

              <UImage src={videoInfo.pic} fit='contain' className='h-80 lg:h-96 rounded-lg bg-black' />

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
