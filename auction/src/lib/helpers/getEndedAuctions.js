import AWS from 'aws-sdk';
import { GSI } from '../constants/GSI';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getEndedAuctions() {
  const now = new Date();

  const result = await dynamodb
    .query({
      TableName: process.env.AUCTIONS_TABLE,
      IndexName: GSI.STATUS_AND_ENDDATE, // search with
      KeyConditionExpression: '#status = :status AND endingAt <= :now', // status: OPEN && endingAt "overDue"
      ExpressionAttributeValues: {
        ':status': 'OPEN',
        ':now': now.toISOString(), // dynamodb can sort ISOStrings()
      },
      ExpressionAttributeNames: {
        '#status': 'status', // status is reserved word (like class) #replace in (KeyConditionExpression)
      },
    })
    .promise();

  return result.Items;
}

export { getEndedAuctions };
