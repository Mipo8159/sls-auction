// PUBLIC ROUTE FOR TESTING
async function publicRoute(event, context) {
  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: 'Hi ⊂◉‿◉つ from Public API',
    }),
  };
}

export const handler = publicRoute;
