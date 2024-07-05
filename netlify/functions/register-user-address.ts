import { Handler } from '@netlify/functions';

const handler: Handler = async event => {
  const chainalysisURL = process.env.VITE_CHAINALYSIS_API_URL;
  const chainalysisToken = process.env.VITE_CHAINALYSIS_TOKEN;

  if (!chainalysisURL || !chainalysisToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Chainalysis API URL and token are required',
      }),
    };
  }

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Address is required',
      }),
    };
  }

  const options = {
    method: 'POST',
    headers: {
      Token: chainalysisToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: event.queryStringParameters.address,
    }),
  };

  const response = await fetch(chainalysisURL, options);

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({
        message: await response.text(),
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: await response.json(),
    }),
  };
};

export { handler };
