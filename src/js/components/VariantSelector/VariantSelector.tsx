import React from 'react';
import { ButtonGroup, IconButton } from '@wordpress/components';

import './VariantSelector.css';

type VariantSelectorProps = {
  variants: ABTestVariant[];
  onSelectVariant: (id: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, onSelectVariant }) => (
  <div className="ab-test-for-wp__VariantSelector">
    <ButtonGroup>
      {variants.map((variant) => (
        <IconButton
          icon={<div />}
          isToggled={variant.selected}
          onClick={(): void => onSelectVariant(variant.id)}
        >
          {variant.name}
        </IconButton>
      ))}
      <IconButton icon="admin-generic" />
    </ButtonGroup>
  </div>
);

export default VariantSelector;
