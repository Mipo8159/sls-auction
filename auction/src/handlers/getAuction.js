import middify from '../lib/helpers/middify';
import { getAuctionById } from '../lib/helpers/getAuctionById';

async function getAuction(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middify(getAuction);
