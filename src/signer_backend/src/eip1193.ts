import { sepolia } from 'viem/chains'
import { doPost } from './transport'
import { id } from 'azle'

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
  return {
    async request({ method, params }: { method: string, params: unknown[] }) {
      const payload = JSON.stringify(jsonRpc(method, params))
      const res = await doPost(url, payload, { target: id(), name: 'rpcTransform'})
      return JSON.parse(res).result
    }
  }
}

export {
  createTransport
}