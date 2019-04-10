// @flow @jsx wp.element.createElement

import { i18n, components, data } from '../../wp';

import './GeneralSettings.css';

const { __ } = i18n;
const { PanelBody, ToggleControl, TextControl } = components;
const { select } = data;

type GeneralSettingsProps = {
  isSingle: boolean;
  title: string;
  isEnabled: boolean;
  onChangeTitle: (title: string) => void;
  onChangeEnabled: (enabled: boolean) => void;
};

function GeneralSettings({
  isSingle,
  title,
  isEnabled,
  onChangeTitle,
  onChangeEnabled,
}: GeneralSettingsProps) {
  const { getCurrentPostId } = select('core/editor');
  const postId = getCurrentPostId();

  return (
    <PanelBody title={__('General Settings')}>
      {!isSingle && (
        <TextControl
          label={__('Title of test')}
          value={title}
          onChange={onChangeTitle}
        />
      )}
      <ToggleControl
        label={__('Run this test')}
        help={__(isEnabled ? 'Test is in progress' : 'Showing control variant to every visitor')}
        checked={isEnabled}
        onChange={onChangeEnabled}
      />
      {isSingle && postId && (
        <div className="shortcode-container">
          <strong>Shortcode:</strong>
          <code>{`[ab-test id=${postId}]`}</code>
        </div>
      )}
    </PanelBody>
  );
}

export default GeneralSettings;
