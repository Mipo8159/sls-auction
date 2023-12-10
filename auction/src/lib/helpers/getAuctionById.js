import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuctionById(id) {
  let auction;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with id ${id} not found`);
  }

  return auction;
}

export { getAuctionById };
