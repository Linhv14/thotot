import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly bucket = this.configService.getOrThrow('AWS_BUCKET')
    private readonly region = this.configService.getOrThrow('AWS_S3_REGION')
    private readonly s3Client = new S3Client({
        region: this.region
    })
    constructor(private readonly configService: ConfigService) { }

    async upload(file: Express.Multer.File, ID: number) {
        const key = `${ID}-${uuidv4()}-${file.originalname}`
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            }),
        );
        return key
    }

    async delete(ID: number, key: string, ) {
        if (!key) return
        if (key.split("-").shift() != JSON.stringify(ID))
            throw new HttpException("Access denied", HttpStatus.FORBIDDEN)

        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
        )
    }

    private _getURL(key: string) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
    }
}
