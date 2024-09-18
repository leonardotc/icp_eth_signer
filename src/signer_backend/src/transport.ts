import { serialize, Some, nat64 } from 'azle/experimental'
import { id, Principal, IDL } from 'azle'
import { HttpResponse } from 'azle/canisters/management'

const doPost = async (url: string, body: string): Promise<string> => {
  const rawResponse = await fetch('icp://aaaaa-aa/http_request', {
    body: serialize({
      args: [
        {
          url,
          max_response_bytes: [2_000n],
          method: { post: null },
          headers: [{
            name: 'Content-Type',
            value: 'application/json'
          }],
          body: [new Uint8Array(Buffer.from(body, 'utf-8'))],
          transform: [{
            function: [id(), 'ethTransform'] as [
              Principal,
              string
            ],
            context: Uint8Array.from([])
          }]
        }
      ],
      cycles: 50_000_000n
    })
  })

  const response: HttpResponse = await rawResponse.json()
  return Buffer.from(response.body.buffer).toString('utf-8')
}

export {
  doPost
}