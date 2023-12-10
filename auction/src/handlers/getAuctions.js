import AWS from 'aws-sdk';
import createError from 'http-errors';
import middify from '../lib/helpers/middify';
import validify from '../lib/helpers/validify';

import { GSI } from '../lib/constants/GSI';
import { getAuctionsSchema } from '../lib/schemas/getAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuctions(event) {
  const { status } = event.queryStringParameters;
  let auctions;

  try {
    const result = await dynamodb
      .query({
        TableName: process.env.AUCTIONS_TABLE,
        IndexName: GSI.STATUS_AND_ENDDATE,
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
          ':status': status,
        },
        ExpressionAttributeNames: {
          '#status': 'status',
        },
      })
      .promise();

    auctions = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middify(getAuctions).use(validify(getAuctionsSchema));
