import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function setAuctionPictureUrl(id, pictureUrl) {
  const result = await dynamodb
    .update({
      TableName: process.env.AUCTIONS_TABLE,
      Key: { id },
      UpdateExpression: 'set pictureUrl = :pictureUrl',
      ExpressionAttributeValues: {
        ':pictureUrl': pictureUrl,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return result.Attributes;
}

export { setAuctionPictureUrl };
