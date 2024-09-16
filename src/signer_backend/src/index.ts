import { EcdsaPublicKeyResult, SignWithEcdsaResult } from 'azle/canisters/management'
import { query, IDL, update } from 'azle'
import { serialize } from 'azle/experimental'
import { toBytes, toHex, Hex, Address } from 'viem'
import { publicKeyToAddress } from 'viem/accounts'

const KEY_NAME = 'dfx_test_key'

let publicKey: Address

export default class Canister {
    @update([IDL.Text], IDL.Text)
    async sign(message: string): Promise<string> {
        const rawResponse = await fetch('icp://aaaaa-aa/sign_with_ecdsa', {
            body: serialize({
                args: [
                    {
                        message_hash: toBytes(message as Hex),
                        derivation_path: [],
                        key_id: {
                            curve: { secp256k1: null },
                            name: KEY_NAME
                        }
                    }
                ]
            })
        })
        const response: SignWithEcdsaResult = await rawResponse.json();
        return toHex(response.signature)
    }

    @update([])
    async updateAddress(): Promise<void> {
        const rawResponse = await fetch('icp://aaaaa-aa/ecdsa_public_key', {
            body: serialize({
                args: [
                    {
                        canister_id: [],
                        derivation_path: [],
                        key_id: {
                            curve: { secp256k1: null },
                            name: KEY_NAME
                        }
                    }
                ]
            })
        })
        const response: EcdsaPublicKeyResult = await rawResponse.json();
        publicKey = toHex(response.public_key)
    }

    @query([], IDL.Text)
    async address(): Promise<string> {
        // Verify costs, its ugly like this because I am assuming update is paid while query aint.
        // return `0x${createKeccakHash('keccak256').update(Buffer.from(publicKey)).digest('hex').slice(-40)}`
        return publicKeyToAddress(publicKey)
    }
}