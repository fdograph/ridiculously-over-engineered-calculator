import { createAction } from 'typesafe-actions';
import { FormulaType, TransformationType } from '../logic/formulas';

export enum CalcActionType {
  ADD_OPERATION = 'CALCULATOR/ACTION/ADD_OPERATION',
  APPLY_TRANSFORM = 'CALCULATOR/ACTION/APPLY_TRANSFORM',
  UPDATE_INPUT = 'CALCULATOR/ACTION/UPDATE_INPUT',
  CLEAR_ALL = 'CALCULATOR/ACTION/CLEAR_ALL',
  CALCULATE = 'CALCULATOR/ACTION/CALCULATE',
}

export const addOperation = createAction(CalcActionType.ADD_OPERATION)<
  FormulaType
>();
export const addInput = createAction(CalcActionType.UPDATE_INPUT)<string>();
export const clearAll = createAction(CalcActionType.CLEAR_ALL)();
export const calculate = createAction(CalcActionType.CALCULATE)();
export const applyTransform = createAction(CalcActionType.APPLY_TRANSFORM)<
  TransformationType
>();
