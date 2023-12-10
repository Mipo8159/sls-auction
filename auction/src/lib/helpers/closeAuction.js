import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
async function closeAuction(auction) {
  await dynamodb
    .update({
      TableName: process.env.AUCTIONS_TABLE,
      Key: { id: auction.id },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeValues: {
        ':status': 'CLOSED',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
    .promise();

  const {
    title,
    seller,
    highestBid: { amount, bidder },
  } = auction;

  // in case item was not sold
  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: `Seller, Auction ${title} finished`,
          body: `No bids on the auction`,
          recipient: seller,
        }),
      })
      .promise();
    return;
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL, // puts message in SQS
      MessageBody: JSON.stringify({
        subject: `Seller, Auction ${title} has finished`,
        body: `Item sold for ${amount}`,
        recipient: seller,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL, // puts message in SQS
      MessageBody: JSON.stringify({
        subject: `Bidder, Auction ${title} has finished`,
        body: `You won the ${title} auction for ${amount}`,
        recipient: bidder,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]); // Send Parallel Messages
}

export { closeAuction };
