// @flow

import React from 'react';
import classNames from 'classnames';

type VariantProps = {
  isSelected: boolean;
  onChangeVariant: (id: string) => void;
} & TestVariant;

function Variant({
  id,
  name,
  isSelected,
  onChangeVariant,
}: VariantProps) {
  return (
    <li
      className={classNames(
        'ab-testing-for-wp__variant',
        { 'ab-testing-for-wp__selected': isSelected },
      )}
    >
      <button
        className="ab-item ab-empty-item"
        type="button"
        onClick={() => onChangeVariant(id)}
      >
        {name}
      </button>
    </li>
  );
}

export default Variant;
