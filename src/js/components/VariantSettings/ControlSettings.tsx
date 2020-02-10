import React from 'react';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

type ControlSettingsProps = {
  value: string;
  variants: ABTestVariant[];
  onChange: (variantId: string) => void;
};

const ControlSettings: React.FC<ControlSettingsProps> = ({ value, variants, onChange }) => (
  <SelectControl
    label={__('Control Variant', 'ab-testing-for-wp')}
    value={value || '0'}
    options={variants.map((variant) => ({ label: variant.name, value: variant.id }))}
    onChange={(newValue): void => onChange(newValue)}
  />
);

export default ControlSettings;
