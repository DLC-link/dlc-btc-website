import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { RootState } from '@store/index';

interface UserAddressRegistrationResponse {
  address: string;
}

interface Exposure {
  category: string;
  value: number;
}

interface RuleTriggered {
  risk: string;
  minThreshold: number;
  maxThreshold: number;
}

interface Trigger {
  category: string;
  percentage: number;
  message: string;
  ruleTriggered: RuleTriggered;
}

interface AddressIdentification {
  name: string;
  category: string;
  description: string;
}

interface Cluster {
  name: string;
  category: string;
}

interface UserAddressRiskResponse {
  address: string;
  risk: string;
  riskReason: string | null;
  cluster: Cluster | null;
  addressIdentifications: AddressIdentification[];
  exposures: Exposure[];
  triggers: Trigger[];
  status: string;
}

export function useRisk(): UserAddressRiskResponse | undefined {
  const { address } = useSelector((state: RootState) => state.account);

  const { data: risk } = useQuery(['userAddressRisk'], registerAndFetchUserAddressRisk);

  async function registerAndFetchUserAddressRisk(): Promise<UserAddressRiskResponse> {
    const chainalysisToken = import.meta.env.VITE_CHAINALYSIS_TOKEN;

    if (!address) {
      throw new Error('Address is required');
    }

    const fetchUserAddressRiskResponse = await fetchUserAddressRisk(chainalysisToken, address);

    if (typeof fetchUserAddressRiskResponse === 'string') {
      await registerUserAddress(chainalysisToken, address);
      const fetchUserAddressRiskResponse = await fetchUserAddressRisk(chainalysisToken, address);
      if (typeof fetchUserAddressRiskResponse === 'string') {
        throw new Error(fetchUserAddressRiskResponse);
      }
      return fetchUserAddressRiskResponse;
    }

    return fetchUserAddressRiskResponse;
  }

  async function fetchUserAddressRisk(
    chainalysisToken: string,
    userAddress: string
  ): Promise<UserAddressRiskResponse | string> {
    const riskEndpoint = `https://api.chainalysis.com/api/risk/v2/entities/${userAddress}`;
    const options = {
      method: 'GET',
      headers: {
        Token: chainalysisToken,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(riskEndpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async function registerUserAddress(
    chainalysisToken: string,
    userAddress: string
  ): Promise<UserAddressRegistrationResponse> {
    const registerEndpoint = 'https://api.chainalysis.com/api/risk/v2/entities';
    const options = {
      method: 'POST',
      headers: {
        Token: chainalysisToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
      }),
    };

    const response = await fetch(registerEndpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  return risk;
}
