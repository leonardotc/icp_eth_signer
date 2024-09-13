import { Canister, text, query, update, Void, serialize, Opt, None, Some } from 'azle/experimental'
import { EcdsaPublicKeyResult } from 'azle/canisters/management'
import createKeccakHash from 'keccak'

let publicKey: Uint8Array

export default Canister({
    update: update([], Void, async () => {
        // Very beautiful but it doesnt work
        // const rawResponse = await call(
        //     PRINCIPAL,
        //     FUNCS.ecdsa_public_key,
        //     {
        //         args: [{
        //             canister_id: [],
        //             derivation_path: [],
        //             key_id: {
        //                 curve: { secp256k1: null },
        //                 name: 'dfx_test_key'
        //             }
        //         }]
        //     }
        // )
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
    }),
    address: query([], text, async () => {
        return `0x${createKeccakHash('keccak256').update(Buffer.from(publicKey)).digest('hex').slice(-40)}`
    })
})
