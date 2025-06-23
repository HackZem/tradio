import { Query, Resolver } from "@nestjs/graphql"

import { CategoryService } from "./category.service"
import { CategoryModel } from "./models/category.model"

@Resolver("Category")
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: "findAllCategories" })
	public async findAll() {
		return this.categoryService.findAll()
	}
}
