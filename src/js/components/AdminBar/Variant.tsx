import React from 'react';
import classNames from 'classnames';

type VariantProps = {
  isSelected: boolean;
  onChangeVariant: (id: string) => void;
} & TestVariant;

const Variant: React.FC<VariantProps> = ({
  id,
  name,
  isSelected,
  onChangeVariant,
}: VariantProps) => (
  <li
    className={classNames(
      'ab-testing-for-wp__variant',
      { 'ab-testing-for-wp__selected': isSelected },
    )}
  >
    <button
      className="ab-item ab-empty-item"
      type="button"
      onClick={(): void => onChangeVariant(id)}
    >
      {name}
    </button>
  </li>
);

export default Variant;
