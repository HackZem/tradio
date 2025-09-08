import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	DeleteObjectsCommand,
	DeleteObjectsCommandInput,
	ListObjectsV2Command,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class S3Service {
	private readonly client: S3Client
	private readonly bucket: string

	public constructor(private readonly configService: ConfigService) {
		this.client = new S3Client({
			endpoint: this.configService.getOrThrow<string>("S3_ENDPOINT"),
			region: this.configService.getOrThrow<string>("S3_REGION"),
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>("S3_ACCESS_KEY_ID"),
				secretAccessKey: this.configService.getOrThrow<string>(
					"S3_SECRET_ACCESS_KEY",
				),
			},
			forcePathStyle: true,
		})

		this.bucket = this.configService.getOrThrow<string>("S3_BUCKET_NAME")
	}

	public async upload(buffer: Buffer, key: string, mimetype: string) {
		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: buffer,
			ContentType: mimetype,
		}

		try {
			await this.client.send(new PutObjectCommand(command))
		} catch (err) {
			throw err
		}
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
		}

		try {
			await this.client.send(new DeleteObjectCommand(command))
		} catch (err) {
			throw err
		}
	}

	public async removeAll() {
		if (this.configService.getOrThrow<string>("NODE_ENV") === "production")
			return

		let continuationToken: string | undefined

		do {
			const listedObjects = await this.client.send(
				new ListObjectsV2Command({
					Bucket: this.bucket,
					ContinuationToken: continuationToken,
				}),
			)

			if (!listedObjects.Contents || listedObjects.Contents.length === 0) break

			const deleteParams: DeleteObjectsCommandInput = {
				Bucket: this.bucket,
				Delete: {
					Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key! })),
				},
			}

			await this.client.send(new DeleteObjectsCommand(deleteParams))

			continuationToken = listedObjects.NextContinuationToken
		} while (continuationToken)
	}
}
