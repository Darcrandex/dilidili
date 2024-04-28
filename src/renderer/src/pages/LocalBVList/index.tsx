/**
 * @name LocalBVList
 * @description
 * @author darcrand
 */

import { DeleteOutlined, FolderOpenOutlined, MoreOutlined, RedoOutlined } from '@ant-design/icons'
import { ipcActions } from '@renderer/actions'
import { fsService } from '@renderer/services/fs'
import { userService } from '@renderer/services/user'
import UEmpty from '@renderer/ui/UEmpty'
import UImage from '@renderer/ui/UImage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce, useSize } from 'ahooks'
import { Button, Dropdown, Input, Modal, Pagination } from 'antd'
import { isNil, isNotNil } from 'ramda'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BVListItem from './BVListItem'

export default function LocalBVList() {
  const mid = useParams().mid
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: allUps } = useQuery({ queryKey: ['local-files', 'up-list'], queryFn: () => fsService.getUps() })
  const folderDir = allUps?.find((v) => v.mid === mid)?.dir

  const [page, setPage] = useState(1)
  const pageSize = 20
  const [searchText, setSearchText] = useState('')
  const keyword = useDebounce(searchText, { wait: 1000 })

  // reset
  useEffect(() => {
    setPage(1)
    setSearchText('')
  }, [mid])

  const { data: profile } = useQuery({
    enabled: !!mid,
    refetchOnMount: 'always',
    queryKey: ['up', 'info', mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(mid || ''))
  })

  const { data: pageRes } = useQuery({
    refetchOnMount: 'always',
    queryKey: ['bv-list', page, mid, keyword],
    queryFn: () => fsService.getBVListByMid({ mid, page, pageSize, keyword })
  })

  // layout
  const elRef = useRef<HTMLUListElement>(null)
  const wrapperSize = useSize(elRef)
  const itemStyle: CSSProperties = useMemo(() => {
    const wrapperWidth = wrapperSize?.width || window.innerWidth
    const itemMinHeight = 150
    const itemMinWith = itemMinHeight * (16 / 9)
    const cols = Math.floor(wrapperWidth / itemMinWith) || 1
    return { width: `${Math.round(100 / cols)}%` }
  }, [wrapperSize])

  // remove up folder
  const [openRemove, setOpenRemove] = useState(false)
  const onRemoveUpFolder = async () => {
    await ipcActions.deleteFolder(folderDir || '')
    queryClient.invalidateQueries({ queryKey: ['local-files'] })
    setOpenRemove(false)
    navigate('/home/local-bv', { replace: true })
  }

  return (
    <>
      <div className='max-w-2xl mx-auto p-4'>
        {isNotNil(profile) && (
          <section className='flex items-center p-4 rounded-lg bg-slate-50'>
            <UImage src={profile?.card.face} className='shrink-0 w-20 h-20 rounded-full' />

            <div className='flex-1 mx-4'>
              <p className='space-x-2'>
                <span
                  className='font-bold text-xl hover:text-primary transition-colors cursor-pointer'
                  onClick={() => ipcActions.openInBrowser(`https://space.bilibili.com/${mid}`)}
                >
                  {profile?.card.name}
                </span>
                <sup className='inline-block px-1 text-xs bg-orange-500 text-white'>
                  lv.{profile?.card?.level_info?.current_level}
                </sup>
              </p>
              <p className='mt-2 text-gray-500 text-sm'>MID:{mid}</p>
              <p className='text-gray-500 text-sm'>{profile.card.sign}</p>
            </div>

            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'open',
                    icon: <FolderOpenOutlined />,
                    label: '打开文件夹',
                    onClick: () => ipcActions.openFolder(folderDir || '')
                  },

                  { key: 'remove', icon: <DeleteOutlined />, label: '删除文件夹', onClick: () => setOpenRemove(true) }
                ]
              }}
            >
              <Button shape='circle' type='text' icon={<MoreOutlined />} />
            </Dropdown>
          </section>
        )}

        <div className='flex max-w-sm mx-auto my-10 space-x-4'>
          <Input.Search
            maxLength={30}
            placeholder='搜索视频'
            enterButton
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Button
            type='primary'
            icon={<RedoOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['bv-list'] })}
          >
            刷新
          </Button>
        </div>

        <ul ref={elRef} className='flex flex-wrap -mx-4 my-2'>
          {pageRes?.list?.map((v) => (
            <li key={v.bvid} style={itemStyle}>
              <BVListItem bv={v} showUpName={isNil(mid)} className='m-4' />
            </li>
          ))}
        </ul>

        {pageRes?.list?.length === 0 && <UEmpty>啥也没有...</UEmpty>}

        <footer className='my-4'>
          <Pagination
            className='text-center'
            hideOnSinglePage
            current={page}
            pageSize={pageSize}
            total={pageRes?.total || 0}
            onChange={(page) => setPage(page)}
          />
        </footer>
      </div>

      <Modal title='删除文件夹' open={openRemove} onCancel={() => setOpenRemove(false)} onOk={onRemoveUpFolder}>
        <p>确定要删除文件夹吗？</p>
        <p>这个 Up 所有的视频都会被删除哦</p>
      </Modal>
    </>
  )
}
