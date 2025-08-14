# automerge-repo-storage-s3

Automerge storage adapter for AWS S3. More information [here](https://automerge.org/docs/reference/repositories/storage/).

## S3 cost

For high-traffic uses, AWS S3 costs can become significant due to PUT request charges.
Some S3-compatible alternatives such as DigitalOcean, Linode, Backblaze, and Wasabi do not bill per PUT request.

## Installation

```
npm install --save @aws-sdk/client-s3 automerge-repo-storage-s3
```

## Usage example

```ts
import { WebSocketServer } from 'ws'
import { NodeWSServerAdapter } from '@automerge/automerge-repo-network-websocket'
import { AutomergeRepoStorageS3 } from 'automerge-repo-storage-s3'
import { Repo } from '@automerge/automerge-repo'

const wss = new WebSocketServer({ port: 8080 })
const adapter = new NodeWSServerAdapter(wss)
const storage = new AutomergeRepoStorageS3('automerge-s3-test', 'us-east-1')

new Repo({
  network: [adapter],
  storage,
})
```

You can also use a custom S3 client:

```ts
const s3Client = new S3Client({ region: 'us-east-1' })
const storage = new AutomergeRepoStorageS3('automerge-s3-test', s3Client)
```

## Contribution

If you use this package and find some issues, I would appreciate your pull requests. It has not been 100% tested.
