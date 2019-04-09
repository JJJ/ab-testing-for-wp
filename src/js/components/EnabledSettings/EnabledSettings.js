// @flow @jsx wp.element.createElement

import { i18n, components } from '../../wp';

const { __ } = i18n;
const { PanelBody, ToggleControl } = components;

type EnabledSettingsProps = {
  value: boolean;
  onChange: (enabled: boolean) => void;
};

function EnabledSettings({ value, onChange }: EnabledSettingsProps) {
  return (
    <PanelBody title={__('Enable test')}>
      <ToggleControl
        label="Run this test"
        help={__(value ? 'Test is in progress' : 'Showing control variant to every visitor')}
        checked={value}
        onChange={onChange}
      />
    </PanelBody>
  );
}

export default EnabledSettings;
