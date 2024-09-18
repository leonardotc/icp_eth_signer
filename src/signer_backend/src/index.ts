import { query, IDL, update } from 'azle'
import { toHex, Hex, Address } from 'viem'
import { requestPublicKey } from './signatures'
import { createAccount } from './createAccount'
import { createWalletClient } from 'viem'
import { sepolia } from 'viem/chains'
import { createTransport } from './eip1193'
import { HttpResponse, HttpTransformArgs } from 'azle/canisters/management'

let publicKey: Address

export default class Canister {
  @update([IDL.Text, IDL.Text, IDL.Int64], IDL.Text)
  async sendTx(to: string, data: string, value: bigint): Promise<string> {
    const client = createWalletClient({
      transport: createTransport(),
      chain: sepolia,
      account: createAccount()
    })

    return await client.sendTransaction({
      to: to as Hex,
      data: data as Hex,
      value
    })
  }

  @update([])
  async updateAddress(): Promise<void> {
    publicKey = toHex(await requestPublicKey())
  }

  @query([], IDL.Text)
  async address(): Promise<string> {
    // Verify costs, its ugly like this because I am assuming update is paid while query aint.
    // return `0x${createKeccakHash('keccak256').update(Buffer.from(publicKey)).digest('hex').slice(-40)}`
    return publicKey
  }

  @query([HttpTransformArgs], HttpResponse)
  ethTransform(args: HttpTransformArgs): HttpResponse {
    return {
      ...args.response,
      headers: []
    }
  }
}