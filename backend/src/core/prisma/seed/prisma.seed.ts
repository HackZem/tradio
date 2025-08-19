import { BadRequestException, Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import {
	ConditionType,
	LotType,
	Prisma,
	PrismaClient,
	ReturnType,
} from "@prisma/client"
import { hash } from "argon2"
import { Country, ICountry, State } from "country-state-city"
import * as _ from "lodash"

import { LotQueueService } from "../../../modules/lot/queues/lot-queue.service"
import ms from "../../../shared/utils/ms.util"
import { RedisService } from "../../redis/redis.service"

import * as categories from "./data/categories.json"
import * as lots from "./data/lots.json"
import * as usernames from "./data/usernames.json"
import { SeederModule } from "./seeder.module"

const DESCRIPTION =
	"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

const PASSWORD = "19871987"

const logger = new Logger("seed")

function getRandomLocation(countries: ICountry[]) {
	const country = _.sample(countries)

	const regions = State.getStatesOfCountry(country?.isoCode)

	if (regions.length) {
		return {
			country,
			region: _.sample(regions),
		}
	} else {
		return getRandomLocation(countries)
	}
}

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function main() {
	const context = await NestFactory.createApplicationContext(SeederModule)

	const lotQueueService = context.get(LotQueueService)
	const redis = context.get(RedisService)

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

		logger.log("Info successfully deleted")

		await prisma.category.createMany({
			data: categories,
		})

		logger.log("Categories successfuly created")

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const { country, region } = getRandomLocation(Country.getAllCountries())

				await tx.user.create({
					data: {
						username,
						email: `${username}@tradio.com`,
						password: await hash(PASSWORD),
						isEmailVerified: true,
						country: country?.isoCode,
						region: region?.isoCode,
						description: DESCRIPTION,
					},
				})

				logger.log(`User ${username} created`)
			}

			const sellerUsernames = _.sampleSize(usernames, 40)

			let sellerUsername: string
			for (let i = 0; i < sellerUsernames.length; i++) {
				sellerUsername = sellerUsernames[i]

				const user = await tx.user.findUnique({
					where: { username: sellerUsername },
					select: {
						country: true,
						region: true,
						id: true,
					},
				})

				if (!user) {
					logger.warn(`User ${sellerUsername} not found`)
					continue
				}

				if (!user.country || !user.region) {
					logger.warn(`User ${sellerUsername} has not country or region`)
					continue
				}

				let lot: { title: string; category: string }
				for (let j = i * 5; j < i * 5 + 5; j++) {
					lot = lots[j]

					const price = _.random(1, 10000, false)

					const type = _.sample(LotType) ?? LotType.AUCTION

					const createdLot = await tx.lot.create({
						data: {
							title: lot.title,
							type,
							condition: _.sample(ConditionType) ?? ConditionType.NEW,
							returnPeriod: _.sample(ReturnType) ?? ReturnType.NON_RETURNABLE,
							country: user.country,
							region: user.region,
							category: { connect: { slug: lot.category } },
							user: { connect: { id: user.id } },
							isActive: true,
							firstPrice: price,
							currentPrice: price,
							buyNowPrice:
								type !== "AUCTION"
									? price + _.random(0, 11000 - price)
									: undefined,
							expiresAt: new Date(_.now() + ms(`${_.random(7, 14, true)}d`)),
						},
					})

					await lotQueueService.sheduleLotEvents(createdLot)
				}

				logger.log(
					`Five lots have been created for the seller ${sellerUsername}`,
				)
			}
		})

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
