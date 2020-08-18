import { Record, List } from 'immutable';
import {
  FormulaType,
  percent,
  plusMinus,
  TransformationType,
} from './formulas';
import { Operation } from './Operation';

enum ActionType {
  OPERATION,
  TRANSFORMATION,
  INPUT,
}

interface ICalculator {
  readonly lastActionType: ActionType | null;
  readonly operations: List<Operation>;
  readonly currentOperation: Operation | null;
  readonly rawInput: List<string>;
  readonly safeInput: number | null;
  readonly output: string;
}

const DefaultCalculator = Record<ICalculator>({
  lastActionType: null,
  operations: List<Operation>(),
  currentOperation: null,
  rawInput: List<string>(),
  safeInput: null,
  output: '0',
});

export default class Calculator extends DefaultCalculator {
  public static readonly MAX_CHARACTERS = 22;

  private hasCurrentOperation(): boolean {
    return this.get('currentOperation') !== null;
  }

  private getLastValue(): number {
    const safeInput = this.get('safeInput');
    const currentOperation = this.get('currentOperation');
    const lastOperation = this.get('operations').last(null);

    if (safeInput !== null) {
      return safeInput;
    } else if (currentOperation) {
      return currentOperation.get('base');
    } else if (lastOperation) {
      return lastOperation.get<number>('result', 0);
    }

    return 0;
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
    const lastActionType = this.get('lastActionType');
    const currentOperation = this.get('currentOperation');

    if (!currentOperation) {
      throw new Error('There is no open Operation');
    }

    if (
      lastActionType === ActionType.OPERATION ||
      lastActionType === ActionType.TRANSFORMATION
    ) {
      return this.set('currentOperation', currentOperation.set('type', type));
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

    return this.update('rawInput', (chars) =>
      chars.concat(userInput.split('')).slice(Calculator.MAX_CHARACTERS * -1)
    )
      .parseInput()
      .set('lastActionType', ActionType.INPUT)
      .outputRaw();
  }

  public applyTransform(transform: TransformationType): Calculator {
    const input = this.getLastValue();

    const lastValue = this.hasCurrentOperation()
      ? this.get('currentOperation')!.get('base')
      : input;

    switch (transform) {
      case TransformationType.PLUSMINUS:
        return this.set('safeInput', plusMinus(input))
          .set('lastActionType', ActionType.TRANSFORMATION)
          .outputSafe();
      case TransformationType.PERCENT:
        return this.set('safeInput', percent(lastValue, input)).set(
          'lastActionType',
          ActionType.TRANSFORMATION
        );
      default:
        throw new Error('Unknown transformation');
    }
  }

  public addOperation(type: FormulaType): Calculator {
    const base = this.getLastValue();

    return this.hasCurrentOperation()
      ? this.closeAndOpenOp(base, type)
          .clearInput()
          .set('lastActionType', ActionType.OPERATION)
      : this.set('currentOperation', new Operation({ base, type }))
          .clearInput()
          .set('lastActionType', ActionType.OPERATION);
  }

  public calculateResult(): Calculator {
    return this.hasCurrentOperation()
      ? this.applyCurrentOp()
      : this.reApplyPrevOp();
  }

  public clearInput(): Calculator {
    return this.delete('safeInput').delete('rawInput');
  }
}
