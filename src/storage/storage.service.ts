import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(config: ConfigService) {
    const endpoint = config.get('MINIO_ENDPOINT', 'localhost');
    const port = config.get<number>('MINIO_PORT', 9000);
    const useSSL = config.get('MINIO_USE_SSL', 'false') === 'true';

    this.client = new S3Client({
      endpoint: `http${useSSL ? 's' : ''}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.get('MINIO_ROOT_USER', 'minioadmin'),
        secretAccessKey: config.get('MINIO_ROOT_PASSWORD', 'minioadmin'),
      },
      forcePathStyle: true,
    });

    this.bucket = config.get('MINIO_BUCKET', 'morning-plan');
    const publicUrl = config.get('STORAGE_PUBLIC_URL', '');
    this.publicBaseUrl = publicUrl || `http://${endpoint}:${port}/${this.bucket}`;
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(
        new CreateBucketCommand({ Bucket: this.bucket }),
      );
    }
  }

  async uploadIcon(file: Express.Multer.File): Promise<string> {
    await this.ensureBucket();

    const ext = file.originalname.split('.').pop() || 'png';
    const key = `icons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const base = this.publicBaseUrl.replace(/\/$/, '');
    return `${base}/${key}`;
  }
}
