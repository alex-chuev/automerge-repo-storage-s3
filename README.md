# automerge-repo-storage-s3

Automerge storage adapter for AWS S3. More information [here](https://automerge.org/docs/repositories/storage/).

## S3 cost

If your project will have a large number of users and, accordingly, operations, the price of S3 may be significant due
to the large number of PUT requests that are charged. Please take this into account.

## Installation

```
npm install --save @aws-sdk/client-s3 automerge-repo-storage-s3
```

## Usage example

```
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

## Contribution

If you use this package and find some issues, I would appreciate your pull requests. It has not been 100% tested.
