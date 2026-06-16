import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Create an Amazon DynaomDB service client object.
const dynamoClient = new DynamoDBClient({
  region: process.env.DB_REGION || "local",
  
  endpoint: "http://db:8000",

  // credentials: fromCognitoIdentityPool({
  //   client: new CognitoIdentityClient({ region: REGION }),
  //   identityPoolId: IDENTITY_POOL_ID,
  // }),
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

export default dynamoClient;