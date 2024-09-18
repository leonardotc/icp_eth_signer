import { keccak256,
  parseTransaction,
  recoverAddress,
  createWalletClient,
  http,
  toBytes,
  serializeSignature,
  toHex,
  serializeTransaction,
  recoverTransactionAddress
} from 'viem'
import { sepolia } from 'viem/chains'

import { DEPLOY_PK, OWNER_PK } from './pk.js'

const deploy = {
  pk: DEPLOY_PK,
  address: '0x746519355E8C476740c7FC82C178b9063a2987C8'
}
const owner = {
  pk: OWNER_PK,
  address: '0x3Ef0b1Cb40A76Dbb61b3becF0c7a1017722270ee'
}
// const canister = {
//   address: '0x17CFfbF31eAf0B8Eb8aB536BcFd9eC306e9b3d63'
// }


const wallet = createWalletClient({
  address: deploy.address,
  chain: sepolia,
  transport: http()
})

const transaction = await wallet.prepareTransactionRequest({
  to: owner.address,
  value: 10
})

const serialized = serializeTransaction(transaction)

console.log('raw transaction: ', transaction)
console.log('serialized: ', serialized)

const hash = keccak256(serialized)
console.log('hash: ', hash)

const otherHash = '0x529e2a66bf497b5c2679e03502215927fb2d980943327f0e8992036e0562cd5b'
const hashBytes = toBytes(otherHash)
console.log('bytes: ', hashBytes.length)
const signature = '0x986c75241499349831f226ccaae1d1cda92ece5ac45bc85daa250036c565f44301f2ca6404add4257eea50601d40c08e152137f8a017fd58a68b5eaf22436873'
const sigBytes = toBytes(signature)
console.log('bytes: ', sigBytes.length)

const rBytes = sigBytes.slice(0, 32)
const sBytes = sigBytes.slice(32, 64)

const r = toHex(rBytes)
const s = toHex(sBytes)

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
const tx = '0x02f86e83aa36a78084014c158d8503bf96efc482520894746519355e8c476740c7fc82c178b9063a2987c80280c080a09f86716ae8241989a6de2fa182511996af794ffdc4244ac6bd2c0c5b68d2d173a05f1ca42e6b4cd401e13ef2e52ff187170632aef845ccf3b7531c8236a5be8e87'
const parsed = parseTransaction(tx)
const address = await recoverTransactionAddress({
  serializedTransaction: tx
})
console.log('parsed: ', parsed)
console.log('address: ', address)