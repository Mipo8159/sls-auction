const createAuctionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
      },
      required: ['title'], // body requires title
    },
  },
  required: ['body'], // schema required body
};

export { createAuctionSchema };
