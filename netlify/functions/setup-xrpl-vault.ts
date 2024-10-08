import { Handler } from '@netlify/functions';

const handler: Handler = async event => {
  try {
    const setupXRPLVaultEndpoint = `https://devnet-ripple.dlc.link/attestor-1/app/setup-xrpl-vault`;
    const response = await fetch(setupXRPLVaultEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed to setup vault`,
        }),
      };
    }
    const responseData = await response.json();

    return {
      statusCode: 200,
      body: responseData.uuid,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to get Attestor Group Public Key: ${error.message}`,
      }),
    };
  }
};

export { handler };
