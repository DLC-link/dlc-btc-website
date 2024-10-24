export interface ProtocolRewards {
  name: string;
  points: number;
  currentTokens: number;
  multiplier: number;
}

export interface PointsData {
  total: number;
  useTotal: number;
  protocols: ProtocolRewards[];
}
