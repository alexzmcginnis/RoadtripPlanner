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


  input TripInput {
    origin: String
    destination: String
    destinationPois: [String]
    distance: Int
    duration: Int
  }

  type Trip {
    id: ID!,
    origin: String
    destination: String
    destinationPois: [String]
    distance: Int
    duration: Int
  }



  # queries

  type Query {
    getUsers: [User]
    getTrips: [Trip]
  }

  # mutations
  type Mutation {
    createUser(id: ID!, username: String!, city: String, state: String, interests: [String]): User!
    createTrip( input: TripInput): Trip
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

