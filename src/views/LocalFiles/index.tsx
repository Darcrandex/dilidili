/**
 * @name LocalFiles
 * @description
 * @author darcrand
 */

import { useRootPath } from '@/stores/root-path'
import { EChannel } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { useMemo } from 'react'
import BVListItem from './BVListItem'

export default function LocalFiles() {
  const [rootPath] = useRootPath()
  const queryClient = useQueryClient()

  const { data: bvTree } = useQuery({
    queryKey: ['local-files', 'bv-tree', rootPath],
    enabled: !!rootPath,
    queryFn: async () => {
      const res: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
      return res
    },
  })

  const flattenVideoInfos = useMemo(() => {
    return bvTree?.reduce<MainProcess.BVTreeWithInfo['bvs']>((acc, m) => {
      return acc.concat(m.bvs.filter((b) => !!b.info))
    }, [])
  }, [bvTree])

  return (
    <>
      <header>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['local-files', 'dir'] })}>刷新</Button>
      </header>

      <ul className='flex flex-wrap p-4'>
        {flattenVideoInfos?.map((v) => (
          <li key={v.bvid} className='sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
            <BVListItem videoInfo={v.info!} localFolderDir={v.dir} localInfo={v.localInfo} />
          </li>
        ))}
      </ul>
    </>
  )
}
