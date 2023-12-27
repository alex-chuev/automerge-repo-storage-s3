# automerge-repo-storage-s3

Automerge storage adapter for AWS S3. More information [here](https://automerge.org/docs/repositories/storage/).

## Installation

```
npm install --save @aws-sdk/client-s3 automerge-repo-storage-s3
```

## Usage

```
import { Repo } from '@automerge/automerge-repo'
import { AutomergeRepoStorageS3 } from "automerge-repo-storage-s3"

const repo = new Repo({
  storage: new AutomergeRepoStorageS3(BUCKET_NAME, AWS_REGION),
})
```
