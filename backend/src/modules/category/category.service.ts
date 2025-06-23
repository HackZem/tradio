import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/src/core/prisma/prisma.service"

@Injectable()
export class CategoryService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		const categories = await this.prismaService.category.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				lots: {
					include: {
						user: true,
						category: true,
					},
				},
			},
		})

		return categories
	}
}
