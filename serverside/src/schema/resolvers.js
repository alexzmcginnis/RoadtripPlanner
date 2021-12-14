const {getUsersResolver} = require('./resolverFunctions/getUsers.js')
const {createUserResolver} = require('./resolverFunctions/createUser.js')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const { DynamoDB } = require('aws-sdk');


const db = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  accessKeyId: "MOCK_ACCESS_KEY_ID", 
  secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
  endpoint: "http://localhost:8000"
});

const resolvers = {
  Query: {
    getUsers: getUsersResolver,
    getTrips: async () => {
      const tableParams = {
        TableName: "Trip"
      };
      const result = await db.scan(params).promise()
    
      console.log(result)
      return result.item
    }

  },
  Mutation: {
    createUser: createUserResolver,
    createTrip: async (root, {input}) => {
     
      const {origin, destination, destinationPois, distance, duration} = input
      console.log(input)
      const id = uuidv4()
      console.log('id', id)
      const tableParams = {
        TableName: "Trip",
        Item: {
          id,
          origin,
          destination,
          destinationPois,
          distance,
          duration
      }}

      await db.put(tableParams).promise()

      return {
        id,
        origin,
        destination
      }

    }
  }

}

module.exports = {resolvers}

