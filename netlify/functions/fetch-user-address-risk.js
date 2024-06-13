export async function handler(event) {
  const chainalysisURL = process.env.VITE_CHAINALYSIS_API_URL;
  const chainalysisToken = process.env.VITE_CHAINALYSIS_TOKEN;

  const userAddressRiskURL = `${chainalysisURL}/${event.queryStringParameters.address}`;
  const options = {
    method: 'GET',
    headers: {
      Token: chainalysisToken,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(userAddressRiskURL, options);

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
