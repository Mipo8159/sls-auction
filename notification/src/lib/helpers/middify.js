import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(), // No need to JSON.parse()
  ]);
