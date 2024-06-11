export async function handler(event) {
  const address = event.queryStringParameters.address;
  const token = process.env.VITE_CHAINALYSIS_TOKEN;

  const registerEndpoint = 'https://api.chainalysis.com/api/risk/v2/entities';
  const options = {
    method: 'POST',
    headers: {
      Token: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: address,
    }),
  };

  const response = await fetch(registerEndpoint, options);

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
