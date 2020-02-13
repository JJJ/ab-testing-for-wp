import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

type DistributionSettingsProps = {
  variant: ABTestVariant;
  onUpdateDistribution: (id: string, newDistribution: number | undefined) => void;
};

const DistributionSettings: React.FC<DistributionSettingsProps> = ({
  variant,
  onUpdateDistribution,
}) => (
  <RangeControl
    label={sprintf(__('Variant %s distribution', 'ab-testing-for-wp'), variant.name)}
    value={variant.distribution}
    onChange={(nextDistribution): void => onUpdateDistribution(variant.id, nextDistribution)}
    min={0}
    max={100}
  />
);

export default DistributionSettings;
