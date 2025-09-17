import { BadRequestException, Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { createId } from "@paralleldrive/cuid2"
import {
	ConditionType,
	LotType,
	Prisma,
	PrismaClient,
	ReturnType,
} from "@prisma/client"
import { hash } from "argon2"
import axios from "axios"
import { Country, ICountry, IState, State } from "country-state-city"
import * as _ from "lodash"
import * as sharp from "sharp"

import { BidService } from "@/src/modules/bid/bid.service"
import { S3Service } from "@/src/modules/libs/s3/s3.service"

import { LotQueueService } from "../../../modules/lot/queues/lot-queue.service"
import ms from "../../../shared/utils/ms.util"
import { RedisService } from "../../redis/redis.service"

import * as categories from "./data/categories.json"
import * as lotsData from "./data/lots.json"
import * as usernames from "./data/usernames.json"
import { SeederModule } from "./seeder.module"

const DESCRIPTION =
	"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

const PASSWORD = "19871987"

const PRODUCTS_URL = "https://picsum.photos"

const logger = new Logger("seed")

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

const allCountries = Country.getAllCountries()
const countriesWithStates = allCountries.filter(
	(c: ICountry) => State.getStatesOfCountry(c.isoCode)?.length > 0,
)

function getRandomLocation() {
	const country = _.sample(countriesWithStates) as ICountry
	const regions = State.getStatesOfCountry(country.isoCode)
	const region = _.sample(regions) as IState

	return { country, region }
}

async function getRandomImageData() {
	const randomHeight = _.random(800, 1024)
	const randomWidth = _.random(800, 1024)

	try {
		const res = await axios(PRODUCTS_URL + `/${randomWidth}/${randomHeight}`, {
			responseType: "arraybuffer",
		})

		const buffer = Buffer.from(res.data, "binary")

		const processedBuffer = await sharp(buffer)
			.resize(512, 512)
			.webp()
			.toBuffer()

		const mimetype = "image/webp"

		return { buffer: processedBuffer, mimetype }
	} catch (err) {
		logger.error(err)
		throw new BadRequestException("`Failed to download image`")
	}
}

async function main() {
	if (process.env.NODE_ENV === "production") {
		throw new Error("Refusing to run seed in production")
	}

	const context = await NestFactory.createApplicationContext(SeederModule)

	const lotQueueService = context.get(LotQueueService)
	const redis = context.get(RedisService)
	const bidService = context.get(BidService)
	const s3Service = context.get(S3Service)

	try {
		logger.log("Starting to filling the database")

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.lot.deleteMany(),
			prisma.category.deleteMany(),
			prisma.notification.deleteMany(),
		])

		const keys = await redis.keys("bull:*")
		if (keys.length) {
			await redis.del(keys)
			console.log(`Deleted ${keys.length} bull keys`)
		}

		s3Service.removeAll()

		logger.log("Info successfully deleted")

		await prisma.category.createMany({
			data: categories,
		})

		logger.log("Categories successfuly created")

		const hashedPassword = await hash(PASSWORD)

		const usersData = (usernames as string[]).map(username => {
			const { country, region } = getRandomLocation()
			return {
				username,
				email: `${username}@tradio.com`,
				password: hashedPassword,
				isEmailVerified: true,
				country: country.isoCode,
				region: region.isoCode,
				description: DESCRIPTION,
			}
		})

		await prisma.user.createMany({ data: usersData, skipDuplicates: true })
		logger.log("Users created (createMany)")

		const allUsers = await prisma.user.findMany({
			select: { id: true, username: true, country: true, region: true },
		})

		const sellers = _.sampleSize(allUsers, 40)

		for (let i = 0; i < sellers.length; i++) {
			const seller = sellers[i]

			if (!seller) {
				logger.warn(`User ${seller} not found`)
				continue
			}

			if (!seller.country || !seller.region) {
				logger.warn(`User ${seller.username} has not country or region`)
				continue
			}

			const LOT_IDS_LIST: string[] = []
			await prisma.$transaction(async tx => {
				let lotData: { title: string; category: string }
				for (let j = i * 5; j < i * 5 + 5; j++) {
					lotData = lotsData[j]

					const price = _.random(1, 10000, false)

					const type = _.sample(LotType) ?? LotType.AUCTION

					const lot = await tx.lot.create({
						data: {
							title: lotData.title,
							type,
							condition: _.sample(ConditionType) ?? ConditionType.NEW,
							returnPeriod: _.sample(ReturnType) ?? ReturnType.NON_RETURNABLE,
							country: seller.country!,
							region: seller.region!,
							category: { connect: { slug: lotData.category } },
							user: { connect: { id: seller.id } },
							isActive: true,
							firstPrice: price,
							currentPrice: price,
							buyNowPrice:
								type !== "AUCTION"
									? price + _.random(0, 11000 - price)
									: undefined,
							...(type !== "BUYNOW"
								? {
										expiresAt: new Date(
											_.now() + ms(`${_.random(7, 14, true)}d`),
										),
									}
								: {}),
						},
					})

					LOT_IDS_LIST.push(lot.id)
				}
			})

			logger.log(
				`Five lots have been created for the seller ${seller.username}`,
			)

			for (const lotId of LOT_IDS_LIST) {
				const randomImageCount = _.random(1, 5)
				for (let i = 0; i < randomImageCount; i++) {
					const { buffer, mimetype } = await getRandomImageData()

					const key = `lots/${lotId}/${createId()}.webp`

					await s3Service.upload(buffer, key, mimetype)

					await prisma.lot.update({
						where: { id: lotId },
						data: {
							photos: {
								create: { key, order: i },
							},
						},
					})
				}

				logger.log(
					`For lot ${lotId} have been created ${randomImageCount} photos`,
				)
			}
		}

		const allLots = await prisma.lot.findMany()

		for (const lot of allLots) {
			if (lot.type === "BUYNOW") continue

			await lotQueueService.scheduleLotEvents(lot)
		}

		logger.log(`All events for all lots has been scheduled`)

		const lots = _.sampleSize(allLots, 40)

		const randomBidders = _.sampleSize(allUsers, _.random(2, 10, false))

		for (const lot of lots) {
			let minAmount: number = lot.firstPrice!.toNumber()
			for (const bidder of randomBidders) {
				const amount = _.random(minAmount, minAmount + 500, false)

				if (lot.buyNowPrice && amount >= lot.buyNowPrice.toNumber()) continue

				if (!bidder) continue

				if (bidder.id === lot.userId) continue

				await bidService.place(bidder.id, { lotId: lot.id, amount })

				minAmount = amount + 1
			}

			logger.log(`For lot ${lot.title} created`)
		}

		logger.log("The database has been successfully filled")
	} catch (err) {
		logger.error(err)
		throw new BadRequestException("Error when filling the database")
	} finally {
		logger.log("Closing the database connection")
		await prisma.$disconnect()
		await context.close()
		logger.log("The database connection closed")
	}
}

main()
