/**
 * @name UPDetail
 * @description UP主文件夹详情
 * @author darcrand
 */

import TopHeader from '@/components/TopHeader'
import { fsService } from '@/services/fs'
import { userService } from '@/services/user'
import UScrollView from '@/ui/UScrollView'
import BVListItem from '@/views/BVList/BVListItem'
import { DeleteOutlined, FolderOpenOutlined, SwapLeftOutlined } from '@ant-design/icons'
import { EChannel } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce, usePagination } from 'ahooks'
import { Button, Input, Pagination, Popconfirm } from 'antd'
import { isNotNil } from 'ramda'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function UPDetail() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mid = useParams().id || ''

  const { data } = useQuery({
    queryKey: ['user', 'card', mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(mid)),
    enabled: !!mid,
    gcTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const { data: fileDirTree } = useQuery({
    queryKey: ['local-files', 'tree'],
    queryFn: () => fsService.getDirTree(),
  })

  const upFolderDir = useMemo(() => fileDirTree?.find((m) => m.mid === mid)?.dir, [fileDirTree, mid])
  const onRemoveDir = async () => {
    await window.ipcRenderer.invoke(EChannel.RemoveDir, upFolderDir)
    queryClient.invalidateQueries({ queryKey: ['local-files'] })
    navigate(-1)
  }

  const bvs = useMemo(() => fileDirTree?.find((m) => m.mid === mid)?.bvs, [fileDirTree, mid])
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce(keyword, { wait: 500 })
  const { data: pageData, pagination } = usePagination(
    async (params) => {
      const skip = (params.current - 1) * params.pageSize

      return {
        list: (bvs || [])
          .slice()
          .sort((a, b) =>
            isNotNil(a.info?.pubdate) && isNotNil(b.info?.pubdate) ? b.info?.pubdate - a.info?.pubdate : 0,
          )
          .filter((v) => !debouncedValue || v.info?.title.includes(debouncedValue))
          .slice(skip, skip + params.pageSize),
        total: bvs?.length || 0,
      }
    },
    {
      defaultCurrent: 1,
      defaultPageSize: 48,
      refreshDeps: [debouncedValue, bvs],
    },
  )

  return (
    <>
      <section className='flex flex-col h-screen'>
        <TopHeader showLogo={false}>
          <Button type='link' icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
        </TopHeader>

        <UScrollView className='flex-1'>
          <div className='max-w-256 mx-auto p-4'>
            <article className='flex items-center bg-slate-50 p-4 rounded-lg'>
              <img
                src={data?.card?.face}
                alt=''
                className='w-20 h-20 rounded-full border-2 border-white'
                referrerPolicy='no-referrer'
              />

              <div className='flex-1 mx-4'>
                <p
                  className='leading-8 transition-all text-primary cursor-pointer'
                  onClick={() =>
                    window.ipcRenderer.invoke(EChannel.OpenInBrowser, `https://space.bilibili.com/${data?.card.mid}`)
                  }
                >
                  {data?.card?.name}
                </p>
                <p className='text-sm text-gray-500'>{data?.card.Official.title || '这个 up 没有简介~~'}</p>
                <p className='text-sm text-gray-500'>{data?.card.sign}</p>
              </div>

              <div className='flex flex-col space-y-2'>
                <Button
                  icon={<FolderOpenOutlined />}
                  onClick={() => window.ipcRenderer.invoke(EChannel.OpenDir, upFolderDir)}
                >
                  打开文件夹
                </Button>

                <Popconfirm title='确定要删除此文件夹以及其中的视频吗?' onConfirm={onRemoveDir}>
                  <Button icon={<DeleteOutlined />}>删除文件夹</Button>
                </Popconfirm>
              </div>
            </article>

            <div className='w-96 mx-auto my-4'>
              <Input.Search
                placeholder='搜索视频'
                maxLength={30}
                value={keyword}
                allowClear
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <ul className='flex flex-wrap'>
              {pageData?.list?.map((v) => (
                <li key={v.bvid} className='p-4 w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
                  <BVListItem bv={v} showUpName={false} />
                </li>
              ))}
            </ul>

            <Pagination
              className='text-center'
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pageData?.total}
              onChange={pagination.onChange}
              hideOnSinglePage
            />
          </div>
        </UScrollView>
      </section>
    </>
  )
}
