const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  accessKeyId: "MOCK_ACCESS_KEY_ID", 
  secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
  endpoint: "http://localhost:8000"
});

const getUsersResolver = async ( parent, args) => {
 

  const params = {
    TableName: "User"
};
const result = await db.scan(params).promise()

console.log('result', result)
return result.Items
 
}

module.exports = {getUsersResolver}