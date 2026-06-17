import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

const dynamoClient = new DynamoDBClient({});

export const handler = async (event) => {
  

  const method = event.requestContext?.http?.method;
  const path = event.rawPath;

  try {

    switch (event.routeKey) {
      case "GET /api/players": {
        const rows = await dynamoClient.send(
          new ScanCommand({
            TableName: "Players_dev"
          })
        );

        const players = (rows.Items || []).map(item =>
          unmarshall(item)
        );

        return {
          statusCode: 200,
          body: JSON.stringify(players)
        };
      }

      case "POST /api/players": {
        const body = JSON.parse(event.body);

        await dynamoClient.send(
          new PutItemCommand({
            TableName: "Players_dev",
            Item: {
              Id: { S: randomUUID() },
              name: { S: body.name },
              age: { N: String(body.age) }
            }
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true
          })
        };
      }

      case "DELETE /api/players/{id}": {

        console.log("Enter to DELETE");
        console.log(event.pathParameters.id);

        await dynamoClient.send(
          new DeleteItemCommand({
            TableName: "Players_dev",
            Key: {
              Id: { S: event.pathParameters.id }
            }
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true
          })
        };
      }

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: "Route not found"
          })
        };
    }
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};