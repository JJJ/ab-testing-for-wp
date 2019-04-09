// @flow @jsx wp.element.createElement

import { i18n, components } from '../../wp';

const { __ } = i18n;
const { PanelBody, ToggleControl, TextControl } = components;

type GeneralSettingsProps = {
  name: string;
  isEnabled: boolean;
  onChangeName: (name: string) => void;
  onChangeEnabled: (enabled: boolean) => void;
};

function GeneralSettings({
  name,
  isEnabled,
  onChangeName,
  onChangeEnabled,
}: GeneralSettingsProps) {
  return (
    <PanelBody title={__('General Settings')}>
      <TextControl
        label={__('Name of test')}
        value={name}
        onChange={onChangeName}
      />
      <ToggleControl
        label={__('Run this test')}
        help={__(isEnabled ? 'Test is in progress' : 'Showing control variant to every visitor')}
        checked={isEnabled}
        onChange={onChangeEnabled}
      />
    </PanelBody>
  );
}

export default GeneralSettings;
