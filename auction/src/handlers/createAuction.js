// Event -> Information (body, headers)
// Context -> Metadata (middleware -> userId)

import AWS from 'aws-sdk';
import createError from 'http-errors';
import middify from '../lib/helpers/middify';
import validify from '../lib/helpers/validify';

import { Auction } from '../entities/auction.entity';
import { createAuctionSchema } from '../lib/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function createAuction(event) {
  const { title, body } = event.body;
  const { email } = event.requestContext.authorizer;
  const auction = new Auction(title, body, email).bundle();

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middify(createAuction).use(
  validify(createAuctionSchema),
);
