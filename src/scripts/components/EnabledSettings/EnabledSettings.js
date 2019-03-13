// @flow @jsx wp.element.createElement

import { i18n, components } from '../../WP';

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
        help={__('When the test is not running, the control variant is shown to every visitor.')}
        checked={value}
        onChange={onChange}
      />
    </PanelBody>
  );
}

export default EnabledSettings;
