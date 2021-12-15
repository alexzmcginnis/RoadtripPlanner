const AWS = require('aws-sdk');
const {v4} = require('uuid');


const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  accessKeyId: "MOCK_ACCESS_KEY_ID", 
  secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
  endpoint: "http://localhost:8000"
});

const createUserResolver = async(_, args) => {
  //const dynamoDb = new AWS.DynamoDB.DocumentClient();
  //const id = v4();
 
  console.log("create user resolver")
  console.log(args)
  const { username, city, state, interests} = args 
  const id = v4()
  console.log('id', id)

  const tableParams = {
    TableName: "User",
    Item: {
      id,
      username,
      city,
      state,
      interests
    }
  }

  await dynamoDb.put(tableParams).promise()

  return {
    id,
    username
  }

}

module.exports = {createUserResolver};