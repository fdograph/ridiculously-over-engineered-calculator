import { Record, List } from 'immutable';
import {
  FormulaType,
  percent,
  plusMinus,
  TransformationType,
} from './formulas';
import { Operation } from './Operation';

interface ICalculator {
  operations: List<Operation>;
  currentOperation: Operation | null;
  rawInput: List<string>;
  safeInput: number | null;
  output: string;
}

const DefaultCalculator = Record<ICalculator>({
  operations: List<Operation>(),
  currentOperation: null,
  rawInput: List<string>(),
  safeInput: null,
  output: '0',
});

export default class Calculator extends DefaultCalculator {
  private getLastRelevantBase(): number {
    const safeInput = this.get('safeInput');
    const currentOperation = this.get('currentOperation');
    const lastOperation = this.get('operations').last(null);
    return safeInput !== null
      ? safeInput
      : currentOperation
      ? currentOperation.get('base')
      : lastOperation
      ? lastOperation.get('result')!
      : 0;
  }
  private getLastResult(): number {
    return this.get('operations').last<Operation>().get<number>('result', 0);
  }

  private parseInput(): Calculator {
    return this.set('safeInput', Number(this.get('rawInput').join('')));
  }

  private outputRaw(): Calculator {
    return this.set('output', this.get('rawInput').join(''));
  }

  private outputSafe(): Calculator {
    return this.set('output', this.get<number>('safeInput', 0).toString());
  }

  private outputLastResult(): Calculator {
    return this.set('output', this.getLastResult().toString());
  }

  private pushOperation(op: Operation): Calculator {
    return this.update('operations', (ops) => ops.push(op));
  }

  private reApplyPrevOp(): Calculator {
    const lastOperation = this.get('operations').last<Operation>();

    if (lastOperation === undefined) {
      return this.outputSafe();
    }

    const safeInput = this.get('safeInput');

    const finalBase: number =
      safeInput === null
        ? lastOperation.get<number>('result', 0)
        : lastOperation.get<number>('input', 0);
    const finalInput: number =
      safeInput === null ? lastOperation.get<number>('input', 0) : safeInput;

    const reOperation = lastOperation
      .set('base', finalBase)
      .perform(finalInput);

    return this.pushOperation(reOperation).clearInput().outputLastResult();
  }

  private applyCurrentOp(): Calculator {
    const currentOperation = this.get('currentOperation');
    const safeInput = this.get<number>('safeInput', 0);

    if (!currentOperation) {
      throw new Error('There is no open Operation');
    }

    return this.pushOperation(currentOperation.perform(safeInput))
      .delete('currentOperation')
      .clearInput()
      .outputLastResult();
  }

  private closeAndOpenOp(base: number, type: FormulaType): Calculator {
    const currentOperation = this.get('currentOperation');

    if (!currentOperation) {
      throw new Error('There is no open Operation');
    }

    const completeOperation = currentOperation.perform(base);

    return this.pushOperation(completeOperation).set(
      'currentOperation',
      new Operation({ base: completeOperation.get('result'), type })
    );
  }

  public updateInput(userInput: string): Calculator {
    if (!userInput.length || !/[\d.]/.test(userInput)) {
      throw new Error(`Illegal input character: ${userInput}`);
    }

    if (/[.]/.test(userInput) && this.get('rawInput').includes('.')) {
      userInput = userInput.replace('.', '');
    }

    return this.update('rawInput', (chars) => chars.concat(userInput.split('')))
      .parseInput()
      .outputRaw();
  }

  public applyTransform(transform: TransformationType): Calculator {
    const currentOperation = this.get('currentOperation');
    const input = this.getLastRelevantBase();

    const base = currentOperation ? currentOperation.get('base') : input;

    switch (transform) {
      case TransformationType.PLUSMINUS:
        return this.set('safeInput', plusMinus(input)).outputSafe();
      case TransformationType.PERCENT:
        return this.set('safeInput', percent(base, input));
      default:
        throw new Error('Unknown transformation');
    }
  }

  public addOperation(type: FormulaType): Calculator {
    const currentOperation = this.get('currentOperation');
    const base = this.getLastRelevantBase();

    return currentOperation
      ? this.closeAndOpenOp(base, type).clearInput()
      : this.set(
          'currentOperation',
          new Operation({ base, type })
        ).clearInput();
  }

  public calculateResult(): Calculator {
    const currentOperation = this.get('currentOperation');

    return currentOperation ? this.applyCurrentOp() : this.reApplyPrevOp();
  }

  public clearInput(): Calculator {
    return this.delete('safeInput').delete('rawInput');
  }
}
