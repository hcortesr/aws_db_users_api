import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, DeleteItemCommand, DescribeTableCommand, CreateTableCommand  } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import dynamoClient from "./db_connection.js";
import express from 'express';
import cors from 'cors';

let counter = 0;

const app = express();
app.use(express.json());
app.use(cors());

async function checkTable(tableName) {
  try {
    await dynamoClient.send(new DescribeTableCommand({
      TableName: tableName,
    }));

    console.log("Table already exists");
  } catch {
    
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
    console.log("Table was created");
    return response;

  }

}

await checkTable("Players");

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const rows = await dynamoClient.send(new ScanCommand({
      TableName: "Players"
    }));
    
    console.log(rows.Items);
    const players = rows.Items.map(item => unmarshall(item));

    res.json(players);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// POST add item
app.post("/api/items", async (req, res) => {
  const value = req.body;
  console.log(value);
  try {

    console.log("try");
    await dynamoClient.send(
    new PutItemCommand({
      TableName: "Players",
      Item: {
        Id: { S: String(counter) },
        name: { S: value.name },
        age: { N: value.age }
      }
    })
);
    console.log("no try");

    counter++;
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
app.delete("/api/items/:id", async (req, res) => {
  try {
    await dynamoClient.send(
      new DeleteItemCommand({
        TableName: "Players",
        Key: {
          Id: { S: req.params.id }
        }
      })
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
