import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

type DistributionSettingsProps = {
  variants: ABTestVariant[];
  onUpdateVariants: (variants: ABTestVariant[]) => void;
};

const DistributionSettings: React.FC<DistributionSettingsProps> = ({
  variants,
  onUpdateVariants,
}) => {
  const onUpdateDistribution = (id: string, newDistribution: number | undefined): void => {
    if (!newDistribution) return;

    const otherVariants = variants.filter((test) => test.id !== id);
    const combinedLeft = otherVariants.reduce((a, b) => a + (b.distribution || 0), 0);
    const rate = combinedLeft !== 0 ? (100 - newDistribution) / combinedLeft : 0;

    onUpdateVariants(variants.map((variant) => {
      if (variant.id === id) {
        return {
          ...variant,
          distribution: newDistribution,
        };
      }

      return {
        ...variant,
        distribution: Math.round(combinedLeft === 0
          ? (100 - newDistribution) / otherVariants.length
          : variant.distribution * rate),
      };
    }));
  };

  return variants.map((variant) => (
    <RangeControl
      label={sprintf(__('Variant %s distribution', 'ab-testing-for-wp'), variant.name)}
      value={variant.distribution}
      onChange={(nextDistribution): void => onUpdateDistribution(variant.id, nextDistribution)}
      min={0}
      max={100}
    />
  ));
};

export default DistributionSettings;
