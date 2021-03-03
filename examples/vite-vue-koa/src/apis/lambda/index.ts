import { useContext } from '@midwayjs/hooks'
import { Context } from '@midwayjs/koa'

function useKoaContext(): Context {
  return useContext()
}

export default async () => {
  return {
    message: 'Hello World',
    method: useKoaContext().method,
  }
}

export const get = async () => {
  return 'get'
}

export const post = async (name: string) => {
  return 'post' + name
}
