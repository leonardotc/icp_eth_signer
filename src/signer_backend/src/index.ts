// import { text, query, update, Void, serialize } from 'azle/experimental'
import { EcdsaPublicKeyResult } from 'azle/canisters/management'
import createKeccakHash from 'keccak'
import { query, IDL, update } from 'azle'
import { serialize } from 'azle/experimental'

let publicKey: Uint8Array

export default class Canister{
    @update([])
    async update(): Promise<void> {
        const rawResponse = await fetch('icp://aaaaa-aa/ecdsa_public_key', {
            body: serialize({
                args: [
                    {
                        canister_id: [],
                        derivation_path: [],
                        key_id: {
                            curve: { secp256k1: null },
                            name: 'dfx_test_key'
                        }
                    }
                ]
            })
        })
        const response: EcdsaPublicKeyResult = await rawResponse.json();
        publicKey = response.public_key
    }

    @query([], IDL.Text)
    async address(): Promise<string> {
        // Verify costs, its ugly like this because I am assuming update is paid while query aint.
        return `0x${createKeccakHash('keccak256').update(Buffer.from(publicKey)).digest('hex').slice(-40)}`
    }
}