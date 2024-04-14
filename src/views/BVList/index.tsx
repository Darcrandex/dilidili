/**
 * @name BVList
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, usePagination } from 'ahooks'
import { Input, Pagination } from 'antd'
import { isNotNil } from 'ramda'
import { useState } from 'react'
import BVListItem from './BVListItem'

export default function BVList() {
  const { data: bvs } = useQuery({
    queryKey: ['local-files', 'bvs'],
    queryFn: () => fsService.getAllBVList(),
  })

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
      defaultPageSize: 20,
      refreshDeps: [debouncedValue, bvs],
    },
  )
  return (
    <>
      <div className='max-w-xl px-4 mx-auto'>
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
            <li key={v.bvid} className='p-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5'>
              <BVListItem bv={v} />
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
    </>
  )
}
