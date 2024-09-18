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

const sign = async (hash: Hash, target: Address): Promise<Hex> => {
  const partialSignature = await requestSignature(toBytes(hash))
  if (partialSignature.length != 64) throw new Error('invalid signature')
  const r = toHex(partialSignature.slice(0, 32))
  const s = toHex(partialSignature.slice(32, 64))

  const possibleVs = [27n, 28n]
  const v = possibleVs.find(async v => {
    const signature = serializeSignature({ r, s, v })
    const recovered = await recoverAddress({ hash, signature })
    return isAddressEqual(recovered, target)
  })

  if (!v) throw new Error('expected account could not be recovered')

  return serializeSignature({ r, s, v })
}

export const createAccount = (address: Address = '0xb2D6795Ee7e443a48d2c6EcCB49Ea481F0f44E0d'): Account => {
  return toAccount({
    address,
    async signMessage({ message }) {
      return sign(hashMessage(message), address)
    },
    async signTransaction(transaction) {
      return await sign(keccak256(serializeTransaction(transaction)), address)
    },
    async signTypedData(typedData) {
      return await sign(hashTypedData(typedData), address)
    }
  })
}