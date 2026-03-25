import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import config from '../config';

class S3Service {
  private client: S3Client;
  private bucketTested = false;

  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  /**
   * Ensures that the configured S3 bucket exists, creating it if it doesn't.
   */
  private async ensureBucketExists() {
    if (this.bucketTested) return;

    const bucket = config.s3Bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        console.log(`Bucket ${bucket} not found. Creating...`);
        try {
          await this.client.send(new CreateBucketCommand({ 
            Bucket: bucket,
            // Only specify LocationConstraint if not in us-east-1
            CreateBucketConfiguration: config.aws.region === 'us-east-1' 
              ? undefined 
              : { LocationConstraint: config.aws.region as any }
          }));
          console.log(`Bucket ${bucket} created successfully.`);
        } catch (createError: any) {
          console.error(`Failed to create bucket ${bucket}:`, createError);
          throw createError;
        }
      } else {
        console.error(`Error checking bucket ${bucket}:`, error);
        throw error;
      }
    }

    this.bucketTested = true;
  }

  /**
   * Get the public URL for an S3 object
   * @param key - The S3 object key
   * @returns The full HTTPS URL
   */
  getFileUrl(key: string): string {
    const bucket = config.s3Bucket;
    if (!bucket) return '';
    return `https://${bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType = 'application/octet-stream') {
    const bucket = config.s3Bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    await this.ensureBucketExists();

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(cmd);
    return {
      bucket,
      key,
      url: this.getFileUrl(key),
    };
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
