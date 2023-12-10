import AWS from 'aws-sdk';
import createError from 'http-errors';
import middify from '../lib/helpers/middify';
import validify from '../lib/helpers/validify';

import { getAuctionById } from '../lib/helpers/getAuctionById';
import { placeBidSchema } from '../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function placeBid(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);

  // Bid identity validation
  if (auction.seller === email) {
    throw new createError.Forbidden(`You can't bid on your own auctions!`);
  }

  // Double bid validation
  if (auction.highestBid.bidder === email) {
    throw new createError.Forbidden(`You are already the highest bidder`);
  }

  // Validate auction status
  if (auction.status !== 'OPEN') {
    throw new createError.Forbidden(`Auction is closed`);
  }

  // Bid amount validation
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`,
    );
  }

  let patchResult;
  try {
    const result = await dynamodb
      .update({
        TableName: process.env.AUCTIONS_TABLE,
        Key: { id },
        UpdateExpression:
          'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
          ':amount': amount,
          ':bidder': email,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    patchResult = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(patchResult),
  };
}

export const handler = middify(placeBid).use(validify(placeBidSchema));
