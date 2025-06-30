import { ApolloDriverConfig } from "@nestjs/apollo"
import { ConfigService } from "@nestjs/config"
import GraphQLJSON from "graphql-type-json"
import { join } from "path"

import { isDev } from "@/src/shared/utils/is-dev.util"

export const getGraphQLConfig = (
	configService: ConfigService,
): ApolloDriverConfig => {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow<string>("GRAPHQL_PREFIX"),
		autoSchemaFile: join(process.cwd(), "src/core/graphql/schema.gql"),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
		resolvers: { JSON: GraphQLJSON },
		subscriptions: {
			"graphql-ws": true,
			"subscriptions-transport-ws": true,
		},
	}
}
