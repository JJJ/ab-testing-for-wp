// @flow @jsx wp.element.createElement

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import { i18n, components } from '../../WP';

const { __, sprintf } = i18n;
const { PanelBody, ToggleControl } = components;

type EnabledSettingsProps = {
  value: boolean;
  startedAt: Date | string;
  onChange: (enabled: boolean) => void;
};

function EnabledSettings({ value, startedAt, onChange }: EnabledSettingsProps) {
  return (
    <PanelBody title={__('Enable test')}>
      <ToggleControl
        label="Run this test"
        help={__('When the test is not running, the control variant is shown to every visitor.')}
        checked={value}
        onChange={onChange}
      />
      {startedAt && <p>{sprintf(__('Started: %s ago'), distanceInWordsToNow(startedAt))}</p>}
    </PanelBody>
  );
}

export default EnabledSettings;
