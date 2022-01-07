'use strict';
const AWS = require('aws-sdk')

const db = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  accessKeyId: "MOCK_ACCESS_KEY_ID", 
  secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
  endpoint: "http://localhost:8000"
});

const getUser = async (event) => {
  const {pathParameters} = event
  const {id} = pathParameters

  const params = {
    TableName: "User",
      Key: {
       "id": id,
 
      }, 
  };

  const result = await db.get(params).promise()
  return JSON.stringify(result.Item)

}




const updateInfo = async (event) => {

  const {pathParameters} = event;
  const { newUsername} = pathParameters;
  const id = 'dc040efa-d229-4699-bc73-9267a3e053ad'
  console.log('updateInfo', id, newUsername)
  console.log(event.body)
  const body = JSON.parse(event.body); //this may not be necessary after deploy if have the gateway integration
  const {city, state, interests} = body;


  const params = {
    TableName: "User",
    Key: {
     "id": id,
    }, 
  
    UpdateExpression: 'SET username = :u, city = :c, #st = :s, interests = :i',
    ExpressionAttributeValues: {
      ':u' : newUsername,
      ':c' : city,
      ':s': state,
      ':i' : interests
    },
    ExpressionAttributeNames: {
      "#st": "state"
    },
};

  const newStuff = await db.update(params).promise();
  console.log('new stuff', newStuff)
  return JSON.stringify(newStuff)
}






module.exports = {getUser, updateInfo}