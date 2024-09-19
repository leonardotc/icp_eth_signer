import { toAccount } from "viem/accounts"
import { Address,
  Account,
  hashTypedData,
  Hash,
  Hex,
  keccak256,
  serializeTransaction,
  hashMessage,
  toBytes,
  isAddressEqual,
  recoverAddress,
  serializeSignature,
  toHex
} from 'viem'
import { requestSignature } from "./signatures"

const sign = async (hash: Hash, target: Address): Promise<{ r: Hex, s: Hex, v: bigint }> => {
  const partialSignature = await requestSignature(toBytes(hash))
  if (partialSignature.length != 64) throw new Error('invalid signature')
  const r = toHex(partialSignature.slice(0, 32))
  const s = toHex(partialSignature.slice(32, 64))

  const possibleVs = [27n, 28n]

  for (const v of possibleVs) {
    const signature = serializeSignature({ r, s, v })
    const recovered = await recoverAddress({ hash, signature })
    if (isAddressEqual(recovered, target)) {
      return { r, s, v }    
    }
  }
  
  throw new Error('expected account could not be recovered')
}

export const createAccount = (address: Address): Account<Address> => {
  return toAccount({
    address,
    async signMessage({ message }) {
      const { r, s, v } = await sign(hashMessage(message), address)
      return serializeSignature({ r, s, v })
    },
    async signTransaction(transaction) {
      const signature = await sign(keccak256(serializeTransaction(transaction)), address)
      return serializeTransaction(transaction, signature)
    },
    async signTypedData(typedData) {
      const { r, s, v } =  await sign(hashTypedData(typedData), address)
      return serializeSignature({ r, s, v })
    }
  })
}