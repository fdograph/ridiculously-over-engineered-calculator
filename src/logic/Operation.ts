import { Record } from 'immutable';
import { FormulaType, sum, subtract, multiply, divide } from './formulas';

interface IOperation {
  input?: number;
  base: number;
  type: FormulaType;
  result?: number;
}

const DefaultOperation = Record<IOperation>({
  input: undefined,
  base: 0,
  type: FormulaType.NOOP,
  result: undefined,
});

export class Operation extends DefaultOperation {
  public constructor(config?: Partial<IOperation>) {
    super(config);
  }

  public perform(input: number): Operation {
    const base = this.get('base');

    switch (this.get('type')) {
      case FormulaType.SUM:
        return this.set('result', sum(base, input)).set('input', input);
      case FormulaType.SUBTRACT:
        return this.set('result', subtract(base, input)).set('input', input);
      case FormulaType.MULTIPLY:
        return this.set('result', multiply(base, input)).set('input', input);
      case FormulaType.DIVIDE:
        return this.set('result', divide(base, input)).set('input', input);
      case FormulaType.NOOP:
        return this.set('result', this.get('base')).set('input', input);
      default:
        throw new Error('Unknown operation');
    }
  }
}
