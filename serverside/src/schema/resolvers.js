const {getUsersResolver} = require('./resolverFunctions/getUsers.js')
const {createUserResolver} = require('./resolverFunctions/createUser.js')
const AWS = require('aws-sdk')

const db = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  accessKeyId: "MOCK_ACCESS_KEY_ID", 
  secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
  endpoint: "http://localhost:8000"
});

const resolvers = {
  Query: {
    getUsers: getUsersResolver

  },
  Mutation: {
    createUser: createUserResolver
  }

}

module.exports = {resolvers}

