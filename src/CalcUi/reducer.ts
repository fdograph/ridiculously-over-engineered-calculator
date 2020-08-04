import { createReducer, ActionType } from 'typesafe-actions';
import Calculator from '../logic/Calculator';

import * as actions from './actions';
import { CalcActionType } from './actions';

export type CalcAction = ActionType<typeof actions>;

export const reducer = createReducer<Calculator, CalcAction>(new Calculator())
  .handleType(CalcActionType.ADD_OPERATION, (state, action) =>
    state.addOperation(action.payload)
  )
  .handleType(CalcActionType.UPDATE_INPUT, (state, action) =>
    state.updateInput(action.payload)
  )
  .handleType(CalcActionType.CLEAR_ALL, (state) => state.clear())
  .handleType(CalcActionType.APPLY_TRANSFORM, (state, action) =>
    state.applyTransform(action.payload)
  )
  .handleType(CalcActionType.CALCULATE, (state) => state.calculateResult());
