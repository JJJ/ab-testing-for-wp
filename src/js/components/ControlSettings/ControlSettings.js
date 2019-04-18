// @flow

import React from 'react';

import { i18n, components } from '../../wp';

const { __ } = i18n;
const { PanelBody, SelectControl } = components;

type ControlSettingsProps = {
  value: string;
  variants: ABTestVariant[];
  onChange: (variantId: string) => void;
};

function ControlSettings({ value, variants, onChange }: ControlSettingsProps) {
  return (
    <PanelBody title={__('Control Variant')}>
      <SelectControl
        value={value || 0}
        options={variants.map(variant => ({ label: variant.name, value: variant.id }))}
        onChange={newValue => onChange(newValue)}
      />
    </PanelBody>
  );
}

export default ControlSettings;
