import createError from 'http-errors';
import { getEndedAuctions } from '../lib/helpers/getEndedAuctions';
import { closeAuction } from '../lib/helpers/closeAuction';

async function processAuctions() {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction),
    );
    await Promise.all(closePromises);

    return { close: closePromises.length };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;
