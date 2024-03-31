/**
 * @name PageItem
 * @description 视频分p
 * @author darcrand
 */

import { HandleChannel } from '@electron/enums'
import { mediaService } from '@src/services/media'
import { cls } from '@src/utils/cls'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as R from 'ramda'
import { useEffect, useState } from 'react'

export type PageItemProps = {
  videoInfo: VideoInfoSchema
  pageData: VideoInfoSchema['pages'][number]
}

export default function PageItem(props: PageItemProps) {
  const bvid = props.videoInfo.bvid
  const cid = props.pageData.cid
  const ownerId = props.videoInfo?.owner.mid.toString()

  const { data: pageInfo } = useQuery({
    queryKey: ['page', 'item', props],
    queryFn: () => mediaService.playurl(bvid, cid),
    select: (res) => res.data,
  })

  useEffect(() => {
    console.log('PageItemData', props, pageInfo)
  }, [props, pageInfo])

  const { mutateAsync: startDownload } = useMutation({
    mutationFn: async (quality: number) => {
      // id 相同时，bandwidth 不同
      // 先根据 bandwidth 降序
      // 保证下载的是高码率的
      const videos = R.sort((a, b) => b.bandwidth - a.bandwidth, pageInfo?.dash?.video || [])
      const videoDownloadUrl = videos.find((v) => v.id === quality)?.baseUrl

      const audios = R.sort((a, b) => b.bandwidth - a.bandwidth, pageInfo?.dash?.audio || [])
      const audioDownloadUrl = R.head(audios)?.baseUrl

      if (videoDownloadUrl && audioDownloadUrl) {
        const params: VideoDownloadParams = {
          videoDownloadUrl,
          audioDownloadUrl,
          coverImageUrl: props.videoInfo.pic,
          ownerId,
          bvid,
          page: props.pageData.page,
          quality,
        }

        console.log('开始下载', params)

        const outputPath = await window.ipcRenderer.invoke(HandleChannel.DownloadBV, params)

        console.log('outputPath', outputPath)
      }
    },
  })

  const [quality, setQuality] = useState(0)

  return (
    <>
      <div className='space-x-2'>
        {pageInfo?.support_formats?.map((v) => (
          <button
            key={v.quality}
            className={cls('p-2 border', v.quality === quality ? 'bg-emerald-400 border-emerald-400 text-white' : '')}
            onClick={() => setQuality(v.quality)}
          >
            {v.new_description}
          </button>
        ))}
      </div>

      <footer className='m-4'>
        <button
          disabled={!quality}
          className='p-2 bg-emerald-400 text-white disabled:bg-gray-500'
          onClick={() => startDownload(quality)}
        >
          下载
        </button>
      </footer>
    </>
  )
}
