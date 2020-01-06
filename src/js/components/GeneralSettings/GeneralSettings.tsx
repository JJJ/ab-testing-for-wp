import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { select } from '@wordpress/data';

import './GeneralSettings.css';

type GeneralSettingsProps = {
  isSingle: boolean;
  title: string;
  isEnabled: boolean;
  onChangeTitle: (title: string) => void;
  onChangeEnabled: (enabled: boolean) => void;
};

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  isSingle,
  title,
  isEnabled,
  onChangeTitle,
  onChangeEnabled,
}) => {
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
};

export default GeneralSettings;
