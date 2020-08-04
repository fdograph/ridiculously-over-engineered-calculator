export type Formula = (a: number, b: number) => number;
export type Transform = (a: number) => number;

export const sum: Formula = (a: number, b: number) => {
  return a + b;
};

export const subtract: Formula = (a: number, b: number) => {
  return a - b;
};

export const divide: Formula = (a: number, b: number) => {
  return a / b;
};

export const multiply: Formula = (a: number, b: number) => {
  return a * b;
};

export const percent: Formula = (a: number, b: number) => {
  return (a * b) / 100;
};

export const plusMinus: Transform = (a: number) => {
  return a * -1;
};

export enum FormulaType {
  NOOP = 'CALCULATOR/FORMULA/NOOP',
  SUM = 'CALCULATOR/FORMULA/SUM',
  SUBTRACT = 'CALCULATOR/FORMULA/SUBTRACT',
  MULTIPLY = 'CALCULATOR/FORMULA/MULTIPLY',
  DIVIDE = 'CALCULATOR/FORMULA/DIVIDE',
  // PERCENT = 'CALCULATOR/FORMULA/PERCENT',
}

export enum TransformationType {
  PLUSMINUS = 'CALCULATOR/FORMULA/PLUSMINUS',
  PERCENT = 'CALCULATOR/FORMULA/PERCENT',
}
