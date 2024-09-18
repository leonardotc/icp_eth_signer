import { KEY_NAME } from './constants'
import { EcdsaPublicKeyResult, SignWithEcdsaResult } from 'azle/canisters/management'
import { caller } from 'azle'
import { serialize } from 'azle/experimental'

const path = () => caller().toUint8Array()

const requestPublicKey = async (): Promise<Uint8Array> => {
  const rawResponse = await fetch('icp://aaaaa-aa/ecdsa_public_key', {
    body: serialize({
      args: [
        {
          canister_id: [],
          derivation_path: [path()],
          key_id: {
            curve: { secp256k1: null },
            name: KEY_NAME
          }
        }
      ]
    })
  })

  const response: EcdsaPublicKeyResult = await rawResponse.json()
  return response.public_key
}

const requestSignature = async (messageHash: Uint8Array): Promise<Uint8Array> => {
  const rawResponse = await fetch('icp://aaaaa-aa/sign_with_ecdsa', {
    body: serialize({
      args: [
        {
          message_hash: messageHash,
          derivation_path: [path()],
          key_id: {
            curve: { secp256k1: null },
            name: KEY_NAME
          }
        }
      ]
    })
  })

  const response: SignWithEcdsaResult = await rawResponse.json()
  return response.signature
}

export {
  requestSignature,
  requestPublicKey
}