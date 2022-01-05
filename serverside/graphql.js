const { ApolloServer, gql } = require('apollo-server-lambda');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const {typeDefs} = require('./src/schema/typeDefs.js')
const {resolvers} = require('./src/schema/resolvers.js')



const server = new ApolloServer({
  typeDefs,
  resolvers,

   introspection: true,
   plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

exports.handler = server.createHandler();