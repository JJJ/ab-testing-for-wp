// @flow @jsx wp.element.createElement

import { i18n, components } from '../../wp';

const { __ } = i18n;
const { PanelBody, ToggleControl } = components;

type GeneralSettingsProps = {
  isEnabled: boolean;
  onChangeEnabled: (enabled: boolean) => void;
};

function GeneralSettings({ isEnabled, onChangeEnabled }: GeneralSettingsProps) {
  return (
    <PanelBody title={__('General Settings')}>
      <ToggleControl
        label="Run this test"
        help={__(isEnabled ? 'Test is in progress' : 'Showing control variant to every visitor')}
        checked={isEnabled}
        onChange={onChangeEnabled}
      />
    </PanelBody>
  );
}

export default GeneralSettings;
