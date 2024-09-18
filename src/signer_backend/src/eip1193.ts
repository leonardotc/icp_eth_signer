import { custom } from 'viem'
import { sepolia } from 'viem/chains'
import { doPost } from './transport'

const jsonRpc = (method: string, params: unknown[]) => {
  return {
    jsonrpc: '2.0',
    method,
    params,
    id: 1
  }
}

const createTransport = () => {
  const url = sepolia.rpcUrls.default.http[0]
  return custom({
    async request({ method, params }) {
      const payload = JSON.stringify(jsonRpc(method, params))
      const res = await doPost(url, payload)
      return JSON.parse(res).result
    }
  })
}

export {
  createTransport
}