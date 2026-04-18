import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import config from '../config';

class S3Service {
  private client: S3Client;
  private bucketTested = false;

  constructor() {
    this.client = new S3Client({
      endpoint: config.s3.endpoint,
      region: config.s3.region || 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });

    // GCS does not support the x-id parameter
    this.client.middlewareStack.add(
      (next) => (args: any) => {
        if (args.request.query && args.request.query['x-id']) {
          delete args.request.query['x-id'];
        }
        return next(args);
      },
      { step: 'build', name: 'removeXIdParam' }
    );
  }

  /**
   * Ensures that the configured S3 bucket exists, creating it if it doesn't.
   */
  private async ensureBucketExists() {
    if (this.bucketTested) return;

    const bucket = config.s3.bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        console.log(`Bucket ${bucket} not found. Creating...`);
        try {
          await this.client.send(
            new CreateBucketCommand({
              Bucket: bucket,
            })
          );
          console.log(`Bucket ${bucket} created successfully.`);
        } catch (createError: any) {
          console.error(`Failed to create bucket ${bucket}:`, createError);
          throw createError;
        }
      } else if (error.$metadata?.httpStatusCode === 403) {
        // For GCS, 403 on HeadBucket often just means we lack permission to list/check bucket info
        // but we might still have permission to PutObject. We'll proceed and let the upload fail if truly unauthorized.
        console.warn(`Bucket ${bucket} access restricted (403). Proceeding anyway...`);
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
    const bucket = config.s3.bucket;
    if (!bucket) return '';
    
    // If using a custom endpoint (like GCS or MinIO)
    if (config.s3.endpoint) {
      // Remove trailing slash from endpoint if present
      const baseUrl = config.s3.endpoint.replace(/\/$/, '');
      return `${baseUrl}/${bucket}/${key}`;
    }
    
    // Default AWS S3 format
    return `https://${bucket}.s3.${config.s3.region}.amazonaws.com/${key}`;
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType = 'application/octet-stream') {
    const bucket = config.s3.bucket;
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
    const bucket = config.s3.bucket;
    if (!bucket) throw new Error('S3_BUCKET not configured');

    const cmd = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.client.send(cmd);
  }
}

export default new S3Service();
