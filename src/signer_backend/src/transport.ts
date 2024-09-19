import { serialize } from 'azle/experimental'
import { Principal } from 'azle'
import { HttpResponse } from 'azle/canisters/management'
import { TransformFunction } from './types'

const doPost = async (url: string, body: string, transform: TransformFunction): Promise<string> => {
  const rawResponse = await fetch('icp://aaaaa-aa/http_request', {
    body: serialize({
      args: [
        {
          url,
          max_response_bytes: [20_000n],
          method: { post: null },
          headers: [{
            name: 'Content-Type',
            value: 'application/json'
          }],
          body: [new Uint8Array(Buffer.from(body, 'utf-8'))],
          transform: [{
            function: [transform.target, transform.name] as [
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