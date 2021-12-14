const {gql} = require('apollo-server-lambda');



const typeDefs = gql`

  # types

  type User {
    id: ID!
    username: String!
    city: String
    state: String
    interests: [String]
  }



  # queries

  type Query {
    getUsers: [User]
  }

  # mutations
  type Mutation {
    createUser(id: ID!, username: String!, city: String, state: String, interests: [String]): User!
  }

`
module.exports = {typeDefs}

/**
 * schema design:
 * 
 * need a user authorization thing.  user selects:
 * Id: ID!
 * City: String!
 * Interest: String
 * Interests: [String]
 * Vehicle: String
 */

