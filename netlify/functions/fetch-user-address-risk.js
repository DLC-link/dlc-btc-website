export async function handler(event) {
  const address = event.queryStringParameters.address;
  const token = process.env.VITE_CHAINALYSIS_TOKEN;

  const riskEndpoint = `https://api.chainalysis.com/api/risk/v2/entities/${address}`;
  const options = {
    method: 'GET',
    headers: {
      Token: token,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(riskEndpoint, options);

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
