import { ec } from 'elliptic'
import { publicKeyToAddress} from 'viem/accounts'

const icpPubToAddress = (publicKey: Uint8Array) => {
  const key = new ec('secp256k1').keyFromPublic(publicKey, 'hex')
  const pointBytes = key.getPublic(false, 'hex')
  return publicKeyToAddress(`0x${pointBytes}`)
}

export {
  icpPubToAddress
}