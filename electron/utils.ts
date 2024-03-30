import { customAlphabet } from 'nanoid'

export function sleep(ms?: number) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000))
}

export function uuid(len = 8) {
  return customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', len)()
}
