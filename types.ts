
export enum CalculatorType {
  BET_CALC = 'BET_CALC',
  ARB_CALC = 'ARB_CALC',
  SYSTEM_CALC = 'SYSTEM_CALC',
  ODDS_CONVERTER = 'ODDS_CONVERTER',
  MATCHED_BETTING = 'MATCHED_BETTING',
  AI_INSIGHTS = 'AI_INSIGHTS'
}

export enum OddsFormat {
  DECIMAL = 'DECIMAL',
  FRACTIONAL = 'FRACTIONAL',
  AMERICAN = 'AMERICAN',
  PROBABILITY = 'PROBABILITY'
}

export interface Selection {
  id: string;
  odds: number;
  outcome: 'WIN' | 'LOSS' | 'VOID';
}

export interface CalculationResult {
  totalStake: number;
  totalReturn: number;
  totalProfit: number;
  yield: number;
}
