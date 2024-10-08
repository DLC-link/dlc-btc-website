import { Handler } from '@netlify/functions';
import { Event, ethers } from 'ethers';

import { DetailedEvent } from '../../src/shared/models/ethereum-models';

const handler: Handler = async event => {
  try {
    const getAttestorGroupPublicKeyEndpoint = `https://devnet-ripple.dlc.link/attestor-1/tss/get-extended-group-publickey`;
    const response = await fetch(getAttestorGroupPublicKeyEndpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed to get Attestor Group Public Key`,
        }),
      };
    }
    const responseData = await response.text();

    return {
      statusCode: 200,
      body: responseData,
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
