export async function handler(event) {
  const chainalysisURL = process.env.VITE_CHAINALYSIS_API_URL;
  const chainalysisToken = process.env.VITE_CHAINALYSIS_TOKEN;

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
}
