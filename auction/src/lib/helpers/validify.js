import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

export default (schema) =>
  validator({
    eventSchema: transpileSchema(schema),
    useDefaults: true,
  });
