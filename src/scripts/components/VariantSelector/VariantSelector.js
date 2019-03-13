// @flow @jsx wp.element.createElement

import { components } from '../../WP';

import './VariantSelector.css';

const {
  ButtonGroup,
  IconButton,
} = components;

type VariantSelectorProps = {
  variants: ABTestVariant[];
  onSelectVariant: (id: string) => void;
}

function VariantSelector({ variants, onSelectVariant }: VariantSelectorProps) {
  return (
    <div className="ab-test-for-wp__VariantSelector">
      <ButtonGroup>
        {variants.map(variant => (
          <IconButton
            isToggled={variant.selected}
            onClick={() => onSelectVariant(variant.id)}
          >
            {variant.name}
          </IconButton>
        ))}
        <IconButton icon="ellipsis" />
      </ButtonGroup>
    </div>
  );
}

export default VariantSelector;
