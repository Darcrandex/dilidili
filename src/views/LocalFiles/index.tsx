/**
 * @name LocalFiles
 * @description
 * @author darcrand
 */

import { useRootPath } from '@/stores/root-path'
import { EChannel } from '@electron/enums'
import { useQuery } from '@tanstack/react-query'
import BVList from './BVList'

export default function LocalFiles() {
  const [rootPath] = useRootPath()

  const { data: bvTree } = useQuery({
    queryKey: ['local-files', 'bv-tree', rootPath],
    enabled: !!rootPath,
    queryFn: async () => {
      const res: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
      return res
    },
  })

  return (
    <>
      <BVList bvTree={bvTree} />
    </>
  )
}
