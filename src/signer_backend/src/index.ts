import { query, IDL, update } from 'azle'
import { Hex, Account, Address, custom } from 'viem'
import { requestPublicKey } from './signatures'
import { createAccount } from './createAccount'
import { createWalletClient, createPublicClient, fromHex, parseAbi, encodeEventTopics } from 'viem'
import { sepolia } from 'viem/chains'
import { createTransport } from './eip1193'
import { HttpResponse, HttpTransformArgs } from 'azle/canisters/management'
import { icpPubToAddress } from './icpPubToAddress'
import { ABI } from './constants'

let account: Account<Address>

export default class Canister {
  @update([IDL.Text, IDL.Text, IDL.Int64], IDL.Text)
  async sendTx(to: string, data: string, value: bigint): Promise<string> {
    const client = createWalletClient({
      transport: custom(createTransport()),
      chain: sepolia,
      account
    })

    return await client.sendTransaction({
      to: to as Hex,
      data: data as Hex,
      value
    })
  }

  @update([IDL.Text], IDL.Text)
  async getSomeLog(address: string): Promise<string> {
    const client = createPublicClient({
      transport: custom(createTransport()),
      chain: sepolia
    })

    const logs = await client.getLogs({
      address: address as Address,
      fromBlock: fromHex("0x66E858", 'bigint'),
      events: parseAbi([ 
        'event Approval(address indexed owner, address indexed sender, uint256 value)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ])
    })

    return JSON.stringify(logs, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value)
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