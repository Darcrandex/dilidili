/**
 * @name Search
 * @description
 * @author darcrand
 */

import { mediaService } from '@src/services/media'
import { useSearchData } from '@src/stores/useSearchData'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import PageItem from './PageItem'

export default function Search() {
  const [state, setState] = useSearchData()
  const [queryId, setQueryId] = useState(0)

  const onSearch = () => {
    const regex = /\/video\/(BV[0-9a-zA-Z]+)/
    const match = state.searchUrl.match(regex)
    if (match) {
      const matchedBvid = match[1]
      setState({ ...state, bvid: matchedBvid })
      setQueryId(Date.now())
    } else {
      console.log('未找到 BV 号')
    }
  }

  const { data: videoInfo, isRefetching } = useQuery({
    enabled: !!state.bvid,
    queryKey: ['info', state.bvid, queryId],
    queryFn: () => mediaService.info(state.bvid || ''),
    select: (res) => res.data,
  })

  return (
    <>
      <h1>Search</h1>

      <input
        className='w-full p-2 border'
        type='text'
        value={state.searchUrl}
        onChange={(e) => setState({ ...state, searchUrl: e.target.value })}
      />

      <button className='border p-2' disabled={isRefetching} onClick={onSearch}>
        搜索
      </button>

      <hr className='my-4' />

      <section>
        <p>up: {videoInfo?.owner?.name}</p>
        <img src={videoInfo?.owner?.face} alt='' referrerPolicy='no-referrer' className='w-20' />
      </section>

      <ul className='m-4 space-y-2'>
        {Array.isArray(videoInfo?.pages) && videoInfo?.pages.length
          ? videoInfo?.pages?.map((v) => (
              <li key={v.cid}>
                <p>{v.part}</p>

                <PageItem videoInfo={videoInfo} pageData={v} />
              </li>
            ))
          : null}
      </ul>
    </>
  )
}
