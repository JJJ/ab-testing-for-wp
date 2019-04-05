// @flow @jsx wp.element.createElement

import { i18n, components } from '../../wp';

const { __, sprintf } = i18n;
const { PanelBody, RangeControl } = components;

type DistributionSettingsProps = {
  variants: ABTestVariant[];
  onUpdateVariants: (variants: ABTestVariant[]) => void;
};

function DistributionSettings({ variants, onUpdateVariants }: DistributionSettingsProps) {
  const onUpdateDistribution = (id: string, newDistribution: number) => {
    const otherVariants = variants.filter(test => test.id !== id);
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

  return (
    <PanelBody title={__('Variation distribution')}>
      {variants.map(variant => (
        <RangeControl
          label={sprintf(__('Variation %s'), variant.name)}
          value={variant.distribution}
          onChange={nextDistribution => onUpdateDistribution(variant.id, nextDistribution)}
          min={0}
          max={100}
        />
      ))}
    </PanelBody>
  );
}

export default DistributionSettings;
