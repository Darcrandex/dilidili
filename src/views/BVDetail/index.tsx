/**
 * @name BVDetail
 * @description
 * @author darcrand
 */

import TopHeader from '@/components/TopHeader'
import { fsService } from '@/services/fs'
import { mediaService } from '@/services/media'
import UScrollView from '@/ui/UScrollView'
import { SwapLeftOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function BVDetail() {
  const navigate = useNavigate()
  const bvid = useParams().id

  const { data: bvTree } = useQuery({
    queryKey: ['bv-tree'],
    queryFn: () => fsService.getDirTree(),
  })

  const { data: videoInfo } = useQuery({
    queryKey: ['video', 'info', bvid],
    enabled: !!bvid,
    queryFn: () => mediaService.info(bvid || ''),
  })

  const localInfo = useMemo(() => {
    if (!videoInfo || !bvTree) return null

    const m = bvTree.find((f) => f.mid === videoInfo.owner.mid?.toString())
    return m?.bvs.find((v) => v.bvid === videoInfo.bvid)?.localInfo || null
  }, [bvTree, videoInfo])

  const iframeUrl = bvid ? `https://player.bilibili.com/player.html?bvid=${bvid}` : ''

  if (!videoInfo) return null

  return (
    <>
      <section className='flex flex-col h-screen'>
        <TopHeader showLogo={false}>
          <Button type='link' icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
        </TopHeader>

        <UScrollView className='flex-1'>
          <main className='mx-auto'>
            <h2 className='m-4'>{videoInfo.title}</h2>

            <div className='m-4'>
              {iframeUrl && <iframe className='w-full h-96' src={iframeUrl} title={videoInfo.title} />}
            </div>
          </main>
        </UScrollView>
      </section>
    </>
  )
}
