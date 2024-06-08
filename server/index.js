import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import mergedTypeDef from './typeDefs/index.js';
import mergedResolver from './resolver/index.js';

const server = new ApolloServer({
    typeDefs: mergedTypeDef,
    resolvers: mergedResolver
});

async function startApolloServer(server) {
    const { url } = await startStandaloneServer(server)
    console.log(`Server started at ${url}`)
}
 
startApolloServer(server)