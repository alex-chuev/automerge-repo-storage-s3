import { describe, beforeAll, afterAll } from 'vitest'
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import S3rver from 's3rver'
import { runStorageAdapterTests } from './storage-adapter-tests'
import { AutomergeRepoStorageS3 } from '../src'

const s3Server = new S3rver({
  port: 4568,
  hostname: 'localhost',
  silent: true,
  directory: './test-s3-data',
  configureBuckets: [{ name: 'test-bucket' }],
})

const s3client = new S3Client({
  endpoint: 'http://localhost:4568',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  forcePathStyle: true,
})

beforeAll(async () => {
  await s3Server.run()
})

afterAll(async () => {
  await s3Server.close()
})

describe('AutomergeRepoStorageS3', () => {
  const setup = async () => {
    const teardown = () => {
      s3Server.reset()
    }
    await s3Server.configureBuckets()
    const adapter = new AutomergeRepoStorageS3('test-bucket', s3client)
    return { adapter, teardown }
  }

  runStorageAdapterTests(setup)
})
