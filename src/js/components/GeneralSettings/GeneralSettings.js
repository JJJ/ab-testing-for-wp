// @flow @jsx wp.element.createElement

import { i18n, components } from '../../wp';

const { __ } = i18n;
const { PanelBody, ToggleControl, TextControl } = components;

type GeneralSettingsProps = {
  title: string;
  isEnabled: boolean;
  onChangeTitle: (title: string) => void;
  onChangeEnabled: (enabled: boolean) => void;
};

function GeneralSettings({
  title,
  isEnabled,
  onChangeTitle,
  onChangeEnabled,
}: GeneralSettingsProps) {
  return (
    <PanelBody title={__('General Settings')}>
      <TextControl
        label={__('Title of test')}
        value={title}
        onChange={onChangeTitle}
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
