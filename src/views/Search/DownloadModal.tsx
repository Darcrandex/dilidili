/**
 * @name DownloadModal
 * @description 下载信息确认
 * @author darcrand
 */

import { mediaService } from '@/services/media'
import { cls } from '@/utils/cls'
import { EChannel } from '@electron/enums'
import { sleep } from '@electron/main/utils/common'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useSelections } from 'ahooks'
import { Button, Checkbox, Modal, Select, Space } from 'antd'
import * as R from 'ramda'
import { ReactNode, useMemo, useState } from 'react'

export type DownloadModalProps = {
  videoInfo: MainProcess.VideoInfoSchema
  defaultPage?: number
  trigger?: (onOpen: () => void) => ReactNode
}

export default function DownloadModal(props: DownloadModalProps) {
  // 视频第一个分p
  const { data: playurlData } = useQuery({
    queryKey: ['video', 'playurl', props.videoInfo.bvid, props.videoInfo.cid],
    enabled: !!props.videoInfo.bvid,
    queryFn: () => mediaService.playurl(props.videoInfo.bvid, props.videoInfo.cid),
    select: (res) => res.data,
  })

  // 所有视频分p的数据
  const pageInfoResArr = useQueries({
    queries: props.videoInfo.pages.map((v) => ({
      queryKey: ['video', 'playurl', props.videoInfo.bvid, v.cid],
      enabled: !!props.videoInfo.bvid && !!v.cid,
      queryFn: () => mediaService.playurl(props.videoInfo.bvid, v.cid),
      select: (res: any) => {
        // 获取到视频分p数据后，还需要绑定 page 序号，用于后面匹配
        const info = res.data as MainProcess.PageInfoSchema
        return { page: v.page, info }
      },
    })),
  })

  // 清晰度
  const qualityOptions = useMemo(() => {
    if (!Array.isArray(playurlData?.support_formats)) return []
    return playurlData.support_formats.map((item) => ({
      value: item.quality,
      label: item.new_description,
    }))
  }, [playurlData])

  // 视频分p
  const pages = useMemo(() => {
    if (!Array.isArray(props.videoInfo.pages)) return []
    return props.videoInfo.pages.map((v) => ({ value: v.page, label: v.part }))
  }, [props.videoInfo])

  const [open, setOpen] = useState(false)
  const [quality, setQuality] = useState<number>()

  // 选择分p
  const {
    selected: selectedPages,
    allSelected,
    isSelected,
    toggle,
    toggleAll,
    setSelected,
    partiallySelected,
  } = useSelections(
    pages.map((v) => v.value),
    [props.defaultPage].filter(Boolean) as number[],
  )

  const beforeOpen = () => {
    setQuality(qualityOptions[0]?.value)
    setSelected([props.defaultPage].filter(Boolean) as number[])
    setOpen(true)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onOk = async () => {
    if (!quality || selectedPages.length === 0) return

    const taskParamsArr = selectedPages
      .map((p) => {
        // 根据分p序号找到对应的视频信息
        const matchedPageInfo = pageInfoResArr.find((res) => res?.data?.page === p)?.data?.info

        // id 相同时，bandwidth 不同
        // 先根据 bandwidth 降序
        // 保证下载的是高码率的
        const videos = R.sort((a, b) => b.bandwidth - a.bandwidth, matchedPageInfo?.dash?.video || [])
        const videoDownloadUrl = videos.find((v) => v.id === quality)?.baseUrl || ''

        const audios = R.sort((a, b) => b.bandwidth - a.bandwidth, matchedPageInfo?.dash?.audio || [])
        const audioDownloadUrl = R.head(audios)?.baseUrl || ''

        const params: MainProcess.DownloadBVParams = {
          ownerId: props.videoInfo.owner.mid.toString(),
          bvid: props.videoInfo.bvid,
          page: p,
          quality,
          videoDownloadUrl,
          audioDownloadUrl,
          coverImageUrl: props.videoInfo.pic,
        }

        return params
      })
      .filter((v) => Boolean(v.videoDownloadUrl && v.audioDownloadUrl))

    console.log('tasks', taskParamsArr)
    const tasks = taskParamsArr.map(async (v) => {
      await sleep(Math.random() * 500)
      return window.ipcRenderer.invoke(EChannel.DownloadBV, v)
    })

    await Promise.all(tasks)

    onCancel()
  }

  return (
    <>
      {typeof props.trigger === 'function' && props.trigger(beforeOpen)}

      <Modal width={420} open={open} onCancel={onCancel} footer={null}>
        <section className='space-y-4'>
          <h2 className='mb-8 text-lg font-bold text-center'>下载视频</h2>

          <div className='flex items-center justify-between'>
            <Select
              placeholder='选择清晰度'
              className='w-40'
              options={qualityOptions}
              value={quality}
              onChange={setQuality}
            />

            <Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}>
              全选
            </Checkbox>
          </div>

          <div className='h-60 space-y-2 mb-4 overflow-auto'>
            <ul className='space-y-2'>
              {pages.map((v) => (
                <li
                  key={v.value}
                  className={cls(
                    'px-2 py-1 rounded-md border cursor-pointer transition-all select-none',
                    isSelected(v.value)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-100 hover:bg-primary/10 border-transparent',
                  )}
                  onClick={() => toggle(v.value)}
                >
                  {v.label}
                </li>
              ))}
            </ul>
          </div>

          <Space>
            <Button type='primary' disabled={!quality || !selectedPages.length} onClick={onOk}>
              下载({selectedPages.length})
            </Button>
          </Space>
        </section>
      </Modal>
    </>
  )
}
