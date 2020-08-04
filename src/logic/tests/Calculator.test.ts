import Calculator from '../Calculator';
import { FormulaType, TransformationType } from '../formulas';

describe('Calculator', () => {
  it('Should throw if an illegal character is added', () => {
    const calc = new Calculator();

    expect(() => {
      calc.updateInput('');
    }).toThrow();

    expect(() => {
      calc.updateInput('m');
    }).toThrow();

    expect(() => {
      calc.updateInput('1');
      calc.updateInput('0');
    }).not.toThrow();

    expect(() => {
      calc.updateInput('.');
    }).not.toThrow();

    expect(() => {
      calc.updateInput('123');
    }).not.toThrow();

    expect(() => {
      calc.updateInput('12.000');
    }).not.toThrow();
  });

  it('Should ignore a duplicated "."', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .updateInput('10.')
      .updateInput('20')
      .updateInput('.');

    expect(calc.get('output')).toEqual('1010.20');

    calc = calc.clearInput().updateInput('1').updateInput('.').updateInput('.');
    expect(calc.get('output')).toEqual('1.');

    calc = calc.clearInput().updateInput('1').updateInput('.').updateInput('0');
    expect(calc.get('output')).toEqual('1.0');
  });

  it('Should perform SUM', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.SUM)
      .updateInput('20')
      .calculateResult();

    expect(calc.get('output')).toEqual('30');
  });

  it('Should perform SUBTRACT', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.SUBTRACT)
      .updateInput('20')
      .calculateResult();

    expect(calc.get('output')).toEqual('-10');
  });

  it('Should perform MULTIPLY', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.MULTIPLY)
      .updateInput('20')
      .calculateResult();

    expect(calc.get('output')).toEqual('200');
  });

  it('Should perform DIVIDE', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.DIVIDE)
      .updateInput('2')
      .calculateResult();

    expect(calc.get('output')).toEqual('5');
  });

  it('Should perform PERCENT', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.SUM)
      .updateInput('2')
      .applyTransform(TransformationType.PERCENT)
      .calculateResult();

    expect(calc.get('output')).toEqual('10.2');
  });

  it('Should perform PLUSMINUS', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .applyTransform(TransformationType.PLUSMINUS)
      .calculateResult();

    expect(calc.get('output')).toEqual('-10');
  });

  it('Should calculate a series or operations continuously', () => {
    let calc = new Calculator();

    calc = calc.updateInput('10');
    expect(calc.get('output')).toEqual('10');

    calc = calc.addOperation(FormulaType.SUM);
    expect(calc.get('output')).toEqual('10');

    calc = calc.updateInput('20');
    expect(calc.get('output')).toEqual('20');

    calc = calc.calculateResult();
    expect(calc.get('output')).toEqual('30');

    calc = calc.updateInput('30');
    expect(calc.get('output')).toEqual('30');

    calc = calc.calculateResult();
    expect(calc.get('output')).toEqual('50');

    calc = calc.calculateResult();
    expect(calc.get('output')).toEqual('80');

    calc = calc.addOperation(FormulaType.DIVIDE);
    calc = calc.updateInput('8');

    calc = calc.calculateResult();
    expect(calc.get('output')).toEqual('10');

    calc = calc.addOperation(FormulaType.MULTIPLY).updateInput('5');
    expect(calc.get('output')).toEqual('5');

    calc = calc.calculateResult();
    expect(calc.get('output')).toEqual('50');

    calc = calc.clear();
    expect(calc.equals(new Calculator())).toEqual(true);
  });

  it('Should repeat the last operation when no input given after showing result', () => {
    let calc = new Calculator();

    calc = calc
      .updateInput('10')
      .addOperation(FormulaType.DIVIDE)
      .updateInput('2')
      .calculateResult();

    expect(calc.get('output')).toEqual('5');

    calc = calc.calculateResult();

    expect(calc.get('output')).toEqual('2.5');
  });
});
