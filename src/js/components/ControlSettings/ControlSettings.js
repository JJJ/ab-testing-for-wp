// @flow @jsx wp.element.createElement

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
    <PanelBody title={__('Control variant')}>
      <SelectControl
        value={value || 0}
        options={variants.map(variant => ({ label: variant.name, value: variant.id }))}
        onChange={newValue => onChange(newValue)}
        help={__('Variant you want to serve as the control version. This version will be shown to search engines and saved to caches for SEO.')}
      />
    </PanelBody>
  );
}

export default ControlSettings;
