import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type { Chunk, StorageAdapter, StorageKey } from '@automerge/automerge-repo'

export class AutomergeRepoStorageS3 implements StorageAdapter {
  private s3: S3Client

  constructor(
    private bucketName: string,
    s3orRegion: S3Client | string,
  ) {
    if (typeof s3orRegion === 'string') {
      this.s3 = new S3Client({ region: s3orRegion })
    } else {
      this.s3 = s3orRegion
    }
  }

  async load(key: StorageKey): Promise<Uint8Array | undefined> {
    try {
      const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key.join('/') })
      const result = await this.s3.send(command)
      const bodyContents = await this.streamToBuffer(result.Body as NodeJS.ReadableStream)

      return new Uint8Array(bodyContents)
    } catch (error) {
      if ((error as any).name === 'NoSuchKey') {
        return undefined
      }
      throw error
    }
  }

  async save(key: StorageKey, data: Uint8Array): Promise<void> {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key.join('/'), Body: data })

    await this.s3.send(command)
  }

  async remove(key: StorageKey): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: key.join('/') })

    await this.s3.send(command)
  }

  async loadRange(keyPrefix: StorageKey): Promise<Chunk[]> {
    const output = await this.listObjects(keyPrefix)
    const chunks: Chunk[] = []

    for (const item of output.Contents || []) {
      const key: StorageKey = item.Key!.split('/')
      const data = await this.load(key)

      if (data) {
        chunks.push({ key, data })
      }
    }

    return chunks
  }

  async removeRange(keyPrefix: StorageKey): Promise<void> {
    const output = await this.listObjects(keyPrefix)
    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: (output.Contents || []).map((obj) => ({
          Key: obj.Key,
        })),
      },
    }
    const deleteCommand = new DeleteObjectsCommand(deleteParams)

    await this.s3.send(deleteCommand)
  }

  private async listObjects(keyPrefix: StorageKey): Promise<ListObjectsV2CommandOutput> {
    return await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: keyPrefix.join('/') + '/',
      }),
    )
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = []

      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  }
}
