/**
 * @name BVList
 * @description 以 bv 视图展示的列表
 * @author darcrand
 */

import { SyncOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce, usePagination } from 'ahooks'
import { Button, Input, Pagination } from 'antd'
import { useMemo, useState } from 'react'
import BVListItem from './BVListItem'

const PAGE_SIZE = 48

export type BVListProps = {
  bvTree?: MainProcess.BVTreeWithInfo[]
}

export default function BVList(props: BVListProps) {
  const queryClient = useQueryClient()

  // 数据源
  const flattenVideoInfos = useMemo(() => {
    return props.bvTree?.reduce<MainProcess.BVTreeWithInfo['bvs']>((acc, m) => {
      return acc.concat(m.bvs.filter((b) => !!b.info))
    }, [])
  }, [props.bvTree])

  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce(keyword, { wait: 500 })

  const { data, pagination } = usePagination(
    async (params) => {
      const skip = (params.current - 1) * PAGE_SIZE

      return {
        list: (flattenVideoInfos || [])
          .filter((v) => !debouncedValue || v.info?.title.includes(debouncedValue))
          .slice(skip, skip + PAGE_SIZE),
        total: flattenVideoInfos?.length || 0,
      }
    },
    {
      refreshDeps: [debouncedValue, flattenVideoInfos],
    },
  )

  return (
    <>
      <section className='flex m-4 space-x-4'>
        <Input.Search
          placeholder='输入关键字搜索'
          maxLength={30}
          className='!w-96'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button
          icon={<SyncOutlined />}
          onClick={() => queryClient.invalidateQueries({ queryKey: ['local-files', 'bv-tree'] })}
        />
      </section>

      <ul className='flex flex-wrap'>
        {data?.list?.map((v) => (
          <li key={v.bvid} className='p-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
            <BVListItem localFolderDir={v.dir} videoInfo={v.info} localInfo={v.localInfo} />
          </li>
        ))}
      </ul>

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={data?.total}
        onChange={pagination.onChange}
        hideOnSinglePage
      />
    </>
  )
}
