import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(), // No need to JSON.parse()
    httpEventNormalizer(), // Adjusts API_GW "Events Obj" for less errors
    httpErrorHandler(), // Handling http errors smoothly
  ]);
