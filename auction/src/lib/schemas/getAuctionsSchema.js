import { STATUS } from '../constants/auctionStatus';

const getAuctionsSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: [STATUS.OPEN, STATUS.CLOSED],
          default: STATUS.OPEN,
        },
      },
    },
  },
  required: ['queryStringParameters'], // required properties
};

export { getAuctionsSchema };
