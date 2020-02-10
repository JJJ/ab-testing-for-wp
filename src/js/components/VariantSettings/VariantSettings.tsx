import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import ControlSettings from './ControlSettings';
import DistributionSettings from './DistributionSettings';

type VariantSettingsProps = {
  control: string;
  variants: ABTestVariant[];
  onControlChange: (variantId: string) => void;
  onUpdateVariants: (variants: ABTestVariant[]) => void;
};

const VariantSettings: React.FC<VariantSettingsProps> = ({
  control, variants, onControlChange, onUpdateVariants,
}) => (
  <PanelBody title={__('Variantions', 'ab-testing-for-wp')}>
    <ControlSettings
      value={control}
      variants={variants}
      onChange={onControlChange}
    />
    <DistributionSettings
      variants={variants}
      onUpdateVariants={onUpdateVariants}
    />
  </PanelBody>
);

export default VariantSettings;
