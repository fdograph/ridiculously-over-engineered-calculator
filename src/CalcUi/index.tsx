import React, { useReducer } from 'react';

import Calculator from '../logic/Calculator';
import { reducer } from './reducer';
import {
  addOperation,
  addInput,
  clearAll,
  calculate,
  applyTransform,
} from './actions';
import CalcKey, { KeyType } from './CalcKey';
import { FormulaType, TransformationType } from '../logic/formulas';

import './CalcUi.css';

const CalcUI: React.FC = () => {
  const [calc, dispatch] = useReducer(reducer, new Calculator());

  return (
    <div className="calculator">
      <div className="screen">{calc.get('output')}</div>
      <div className="keyboard">
        <CalcKey
          onClick={() => dispatch(clearAll())}
          type={KeyType.TRANSFORM}
          text="C"
        />
        <CalcKey
          onClick={() => dispatch(applyTransform(TransformationType.PLUSMINUS))}
          type={KeyType.TRANSFORM}
          text="+/-"
        />
        <CalcKey
          onClick={() => dispatch(applyTransform(TransformationType.PERCENT))}
          type={KeyType.TRANSFORM}
          text="%"
        />
        <CalcKey
          onClick={() => dispatch(addOperation(FormulaType.DIVIDE))}
          type={KeyType.OPERATION}
          text="/"
        />

        <CalcKey
          onClick={() => dispatch(addInput('7'))}
          type={KeyType.INPUT}
          text="7"
        />
        <CalcKey
          onClick={() => dispatch(addInput('8'))}
          type={KeyType.INPUT}
          text="8"
        />
        <CalcKey
          onClick={() => dispatch(addInput('9'))}
          type={KeyType.INPUT}
          text="9"
        />
        <CalcKey
          onClick={() => dispatch(addOperation(FormulaType.MULTIPLY))}
          type={KeyType.OPERATION}
          text="X"
        />

        <CalcKey
          onClick={() => dispatch(addInput('4'))}
          type={KeyType.INPUT}
          text="4"
        />
        <CalcKey
          onClick={() => dispatch(addInput('5'))}
          type={KeyType.INPUT}
          text="5"
        />
        <CalcKey
          onClick={() => dispatch(addInput('6'))}
          type={KeyType.INPUT}
          text="6"
        />
        <CalcKey
          onClick={() => dispatch(addOperation(FormulaType.SUBTRACT))}
          type={KeyType.OPERATION}
          text="-"
        />

        <CalcKey
          onClick={() => dispatch(addInput('1'))}
          type={KeyType.INPUT}
          text="1"
        />
        <CalcKey
          onClick={() => dispatch(addInput('2'))}
          type={KeyType.INPUT}
          text="2"
        />
        <CalcKey
          onClick={() => dispatch(addInput('3'))}
          type={KeyType.INPUT}
          text="3"
        />
        <CalcKey
          onClick={() => dispatch(addOperation(FormulaType.SUM))}
          type={KeyType.OPERATION}
          text="+"
        />

        <CalcKey
          className="key--zero"
          onClick={() => dispatch(addInput('0'))}
          type={KeyType.INPUT}
          text="0"
        />
        <CalcKey
          onClick={() => dispatch(addInput('.'))}
          type={KeyType.INPUT}
          text="."
        />
        <CalcKey
          onClick={() => dispatch(calculate())}
          type={KeyType.OPERATION}
          text="="
        />
      </div>
    </div>
  );
};

export default CalcUI;
