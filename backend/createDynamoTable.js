import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: 'local',
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


const main = async () => {
  const command = new CreateTableCommand({
    TableName: "Players",
    
    AttributeDefinitions: [
      {
        AttributeName: "Id",
        AttributeType: "S",

      },
    ],
    KeySchema: [
      {
        AttributeName: "Id",
        KeyType: "HASH",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  const response = await dynamoClient.send(command);
  console.log(response);
  return response;
};
main()
