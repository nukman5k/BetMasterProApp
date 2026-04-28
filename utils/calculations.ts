
import { OddsFormat } from '../types';

export const decimalToFractional = (decimal: number): string => {
  if (decimal <= 1) return "0/1";
  const val = decimal - 1;
  const tolerance = 1.0e-6;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = val;
  do {
    let a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(val - h1 / k1) > val * tolerance);
  return `${h1}/${k1}`;
};

export const decimalToAmerican = (decimal: number): string => {
  if (decimal >= 2.0) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else if (decimal > 1.0) {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
  return "0";
};

export const americanToDecimal = (american: string): number => {
  const val = parseInt(american);
  if (isNaN(val)) return 1.0;
  if (val > 0) return (val / 100) + 1;
  if (val < 0) return (100 / Math.abs(val)) + 1;
  return 1.0;
};

export const fractionalToDecimal = (fractional: string): number => {
  const parts = fractional.split('/');
  if (parts.length !== 2) return 1.0;
  const num = parseFloat(parts[0]);
  const den = parseFloat(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return 1.0;
  return (num / den) + 1;
};

export const toDecimal = (value: string, format: OddsFormat): number => {
  switch (format) {
    case OddsFormat.AMERICAN: return americanToDecimal(value);
    case OddsFormat.FRACTIONAL: return fractionalToDecimal(value);
    case OddsFormat.DECIMAL:
    default: return parseFloat(value) || 1.0;
  }
};

export const fromDecimal = (decimal: number, format: OddsFormat): string => {
  switch (format) {
    case OddsFormat.AMERICAN: return decimalToAmerican(decimal);
    case OddsFormat.FRACTIONAL: return decimalToFractional(decimal);
    case OddsFormat.PROBABILITY: return `${((1 / decimal) * 100).toFixed(2)}%`;
    case OddsFormat.DECIMAL:
    default: return decimal.toFixed(2);
  }
};

export const getCombinations = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  const f = (start: number, current: T[]) => {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      current.push(array[i]);
      f(i + 1, current);
      current.pop();
    }
  };
  f(0, []);
  return result;
};
