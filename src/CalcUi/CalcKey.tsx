import React from 'react';
import classNames from 'classnames';

export enum KeyType {
  TRANSFORM = 'CALCULATOR/KEY/TRANSFORM',
  OPERATION = 'CALCULATOR/KEY/OPERATION',
  INPUT = 'CALCULATOR/KEY/INPUT',
}

interface ICalcKeyProps {
  type: KeyType;
  text: string;
  className?: string;
  onClick: () => void;
}

const CalcKey: React.FunctionComponent<ICalcKeyProps> = ({
  type,
  text,
  onClick,
  className,
}) => {
  return (
    <button
      className={classNames(className, 'key', {
        'key--transform': type === KeyType.TRANSFORM,
        'key--operation': type === KeyType.OPERATION,
        'key--input': type === KeyType.INPUT,
      })}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CalcKey;
