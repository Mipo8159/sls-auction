// API Gateway authorizations are cached (TTL) for 300 seconds.
// Policy will authorize all requests to the same API Gateway instance
// request is coming from, to invoke any additional lambda.

import jwt from 'jsonwebtoken';

const generatePolicy = (principalId, methodArn) => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

async function auth(event, context) {
  if (!event.authorizationToken) {
    throw 'Unauthorized';
  }

  const [, token] = event.authorizationToken.split(' ');

  try {
    const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    throw 'Unauthorized';
  }
}

export const handler = auth;
