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
    <PanelBody className="ABTest__General" title={__('General Settings', 'ab-testing-for-wp')}>
      {!isSingle && (
        <TextControl
          label={__('Title of test', 'ab-testing-for-wp')}
          value={title}
          onChange={onChangeTitle}
        />
      )}
      <ToggleControl
        label={__('Run this test', 'ab-testing-for-wp')}
        help={isEnabled
          ? __('Test is in progress', 'ab-testing-for-wp')
          : __('Showing control variant to every visitor', 'ab-testing-for-wp')}
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
