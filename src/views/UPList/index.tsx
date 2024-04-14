/**
 * @name UPList
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { useQuery } from '@tanstack/react-query'
import UPListItem from './UPListItem'

export default function UPList() {
  const { data } = useQuery({
    queryKey: ['local-files', 'up-list'],
    queryFn: () => fsService.getDirTree(),
  })

  return (
    <>
      <section className='max-w-xl p-4 mx-auto'>
        <ul className='space-y-2'>
          {data?.map((v) => (
            <li key={v.mid}>
              <UPListItem mid={v.mid} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
