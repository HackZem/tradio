import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"

import { SERVER_URL } from "./constants/url.constants"

const httpLink = createHttpLink({
	uri: SERVER_URL,
	credentials: "include",
})

export const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
})
