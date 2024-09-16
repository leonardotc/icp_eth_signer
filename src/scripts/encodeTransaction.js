import { rlp } from 'ethereumjs-util'
import { keccak256,
  recoverAddress,
  createWalletClient,
  http,
  serializeTransaction, 
  toBytes,
  serializeSignature,
  toHex
} from 'viem'
import { sepolia } from 'viem/chains'

const deploy = {
  pk: '0xc9af3645e4f775a3622cfbd5691fe7a83a94b1a6fe7b4538a10cdb82f8d5f20c',
  address: '0x746519355E8C476740c7FC82C178b9063a2987C8'
}
const owner = {
  pk: '0x5c4d104be705122b09c9be39fe89ae8e5ef70be64734b6a0b6d03dbfd80c992d',
  address: '0x3Ef0b1Cb40A76Dbb61b3becF0c7a1017722270ee'
}
const canister = {
  address: '0x17CFfbF31eAf0B8Eb8aB536BcFd9eC306e9b3d63'
}


const wallet = createWalletClient({
  address: deploy.address,
  chain: sepolia,
  transport: http()
})

// const transaction = await wallet.prepareTransactionRequest({
//   to: owner.address,
//   value: 10
// })

// const serialized = serializeTransaction(transaction)

// console.log('raw transaction: ', transaction)
// console.log('serialized: ', serialized)

// const hash = keccak256(serialized)
// console.log('hash: ', hash)

const otherHash = '0x2ab35b8f4a6947eea8c237cabc519f1e6fdfe225ad0f313459b96fc8c3ce6a99'
const hashBytes = toBytes(otherHash)
console.log('bytes: ', hashBytes.length)
const signature = '0xadd3004e716bdc938f813880faa43d28284d5bc210c9aeb5696b8353fa46d4da7deb88e8699b9df19b76420cda8a86b887990bae622268ddd1af7c5973da36c0'
const sigBytes = toBytes(signature)
console.log('bytes: ', sigBytes.length)

const r = toHex(sigBytes.slice(0, 31))
const s = toHex(sigBytes.slice(32, 63))

const possibleVs = [27n, 28n]

possibleVs.map(async v => {
  const sig = serializeSignature({
    r,
    s,
    v
  })

  const recovered = await recoverAddress({
    hash: otherHash, signature: sig
  })
  console.log('address', recovered)
})

