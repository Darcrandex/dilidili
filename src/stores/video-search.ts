import { atom, useAtom } from 'jotai'

const stateAtom = atom({ text: '' })

export function useVideoSearch() {
  return useAtom(stateAtom)
}
