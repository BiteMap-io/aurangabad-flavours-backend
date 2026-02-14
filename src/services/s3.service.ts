import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import config from '../config';

class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType = 'application/octet-stream') {
    const bucket = config.s3Bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(cmd);
    return { bucket, key };
  }

  async deleteObject(key: string) {
    const bucket = config.s3Bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    const cmd = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.client.send(cmd);
  }
}

export default new S3Service();
