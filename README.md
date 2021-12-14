# Road Trip Planner

status: beginning of a project to keep track of roadtrips around the US

first, npm install

# frontend: vue
npm run dev compiles the webpack

# backend: serverless, with AWS lambda
# database: dynamodb, with GraphQL


make sure to globally install serverless.
to run offline, you need to create a docker container for the db.  
sudo docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb

create any tables in that docker container manually via the aws command line

then run:
 npm run start

 to deploy, configure AWS credentials and iams account.  then serverless deploy, which will give your endpoints that should be connected to the front end.
  for deployment: need to change base uri on frontend to deployed uri, not the local host uri