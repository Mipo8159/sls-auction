import middify from '../lib/helpers/middify';
import validify from '../lib/helpers/validify';
import createError from 'http-errors';

import { getAuctionById } from '../lib/helpers/getAuctionById';
import { uploadPictureToS3 } from '../lib/helpers/uploadPictureToS3';
import { uploadAuctionPictureSchema } from '../lib/schemas/uploadAuctionPictureSchema';
import { setAuctionPictureUrl } from '../lib/helpers/setAuctionPictureUrl';

async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id); // fetch auction

  // Validate auction ownership
  if (auction.seller !== email) {
    throw new createError.Forbidden('You do not own the auction');
  }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedAuction;
  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer); // upload to s3
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl); // upload to dunamoDB
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middify(uploadAuctionPicture).use(
  validify(uploadAuctionPictureSchema),
);
