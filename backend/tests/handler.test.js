import { jest } from "@jest/globals";

const sendMock = jest.fn();

jest.unstable_mockModule("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn(() => ({
        send: sendMock
    })),
    ScanCommand: jest.fn(),
    PutItemCommand: jest.fn(),
    DeleteItemCommand: jest.fn()
}));

jest.unstable_mockModule("@aws-sdk/util-dynamodb", () => ({
    unmarshall: jest.fn()
}));

const {
    DynamoDBClient
} = await import("@aws-sdk/client-dynamodb");

const { unmarshall } = await import("@aws-sdk/util-dynamodb");

const { handler } = await import("../lambda_backend.mjs");

describe("handler", () => {
    beforeEach(() => {
        sendMock.mockReset();
        jest.clearAllMocks();
    });

    describe("GET /api/players", () => {
        it("returns players", async () => {
            sendMock.mockResolvedValue({
                Items: [
                    {
                        Id: { S: "1" },
                        name: { S: "John" },
                        age: { N: "20" }
                    }
                ]
            });

            unmarshall.mockReturnValue({
                Id: "1",
                name: "John",
                age: 20
            });

            const response = await handler({
                routeKey: "GET /api/players"
            });

            expect(response.statusCode).toBe(200);

            expect(JSON.parse(response.body)).toEqual([
                {
                    Id: "1",
                    name: "John",
                    age: 20
                }
            ]);
        });
    });

    describe("POST /api/players", () => {
        it("creates a player", async () => {
            sendMock.mockResolvedValue({});

            const response = await handler({
                routeKey: "POST /api/players",
                body: JSON.stringify({
                    name: "John",
                    age: 20
                })
            });

            expect(response.statusCode).toBe(200);

            expect(JSON.parse(response.body)).toEqual({
                success: true
            });

            expect(sendMock).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/players/{id}", () => {
        it("deletes a player", async () => {
            sendMock.mockResolvedValue({});

            const response = await handler({
                routeKey: "DELETE /api/players/{id}",
                pathParameters: {
                    id: "123"
                }
            });

            expect(response.statusCode).toBe(200);

            expect(JSON.parse(response.body)).toEqual({
                success: true
            });

            expect(sendMock).toHaveBeenCalled();
        });
    });

    describe("unknown route", () => {
        it("returns 404", async () => {
            const response = await handler({
                routeKey: "GET /unknown"
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe("error handling", () => {
        it("returns 500 when DynamoDB fails", async () => {
            sendMock.mockRejectedValue(
                new Error("DynamoDB failed")
            );

            const response = await handler({
                routeKey: "GET /api/players"
            });

            expect(response.statusCode).toBe(500);

            expect(JSON.parse(response.body)).toEqual({
                error: "DynamoDB failed"
            });
        });
    });
});