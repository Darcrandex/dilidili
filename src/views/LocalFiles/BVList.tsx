/**
 * @name BVList
 * @description 以 bv 视图展示的列表
 * @author darcrand
 */

import { useDebounce, usePagination } from 'ahooks'
import { Input, Pagination } from 'antd'
import { useMemo, useState } from 'react'
import BVListItem from './BVListItem'

export type BVListProps = {
  bvTree?: MainProcess.BVTreeWithInfo[]
}

export default function BVList(props: BVListProps) {
  // 数据源
  const flattenVideoInfos = useMemo(() => {
    return props.bvTree?.reduce<MainProcess.BVTreeWithInfo['bvs']>((acc, m) => {
      return acc.concat(m.bvs.filter((b) => !!b.info))
    }, [])
  }, [props.bvTree])

  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce(keyword, { wait: 500 })

  const { data, pagination } = usePagination(async (params) => {
    const limit = 48
    const skip = (params.current - 1) * limit
    return {
      list: (flattenVideoInfos || [])
        .filter((v) => !debouncedValue || v.info?.title.includes(debouncedValue))
        .slice(skip, skip + limit),
      total: flattenVideoInfos?.length || 0,
    }
  })

  return (
    <>
      <Input.Search value={keyword} onChange={(e) => setKeyword(e.target.value)} />

      <ul>
        {data?.list?.map((v) => (
          <li key={v.bvid} className='p-2 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
            <BVListItem localFolderDir={v.dir} videoInfo={v.info} localInfo={v.localInfo} />
          </li>
        ))}
      </ul>

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={data?.total}
        onChange={pagination.onChange}
        onShowSizeChange={pagination.onChange}
        hideOnSinglePage
      />

      <h1>BVList</h1>
    </>
  )
}
