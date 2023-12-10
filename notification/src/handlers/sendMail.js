import AWS from 'aws-sdk';
import middify from '../lib/helpers/middify';

const ses = new AWS.SES({ region: process.env.SES_REGION });
async function sendMail(event) {
  const [record] = event.Records; // we process 1 record at a time

  const email = JSON.parse(record.body); // Always string
  const { subject, body, recipient } = email;

  try {
    const result = await ses
      .sendEmail({
        Source: process.env.SES_SOURCE,
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: {
              Data: body,
            },
          },
        },
      })
      .promise();

    return result;
  } catch (error) {
    throw 'Email not delivered';
  }
}

export const handler = middify(sendMail);
