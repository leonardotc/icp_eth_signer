import { query, IDL, update, init } from 'azle'
import { Hex, Account, Address } from 'viem'
import { requestPublicKey } from './signatures'
import { createAccount } from './createAccount'
import { createWalletClient } from 'viem'
import { sepolia } from 'viem/chains'
import { createTransport } from './eip1193'
import { HttpResponse, HttpTransformArgs } from 'azle/canisters/management'
import { icpPubToAddress } from './icpPubToAddress'

let account: Account<Address>

export default class Canister {
  @update([IDL.Text, IDL.Text, IDL.Int64], IDL.Text)
  async sendTx(to: string, data: string, value: bigint): Promise<string> {
    const client = createWalletClient({
      transport: createTransport(),
      chain: sepolia,
      account
    })

    return await client.sendTransaction({
      to: to as Hex,
      data: data as Hex,
      value
    })
  }

  @update([])
  async updateAddress(): Promise<void> {
    const address = icpPubToAddress(await requestPublicKey())
    account = createAccount(address)
  }

  @query([], IDL.Text)
  async address(): Promise<string> {
    return account.address
  }

  @query([HttpTransformArgs], HttpResponse)
  rpcTransform(args: HttpTransformArgs): HttpResponse {
    return {
      ...args.response,
      headers: []
    }
  }
}