import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { LotPhoto } from "@prisma/client"

import { LotModel } from "./lot.model"

@ObjectType()
export class LotPhotoModel implements LotPhoto {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => LotModel)
	public lot: LotModel

	@Field(() => String)
	public lotId: string

	@Field(() => String)
	public key: string

	@Field(() => Int)
	public order: number
}
