import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import ControlSettings from './ControlSettings';
import DistributionSettings from './DistributionSettings';
import Conditionals from './Conditionals';

import './VariantSettings.css';

type VariantSettingsProps = {
  control: string;
  variants: ABTestVariant[];
  onControlChange: (variantId: string) => void;
  onUpdateVariants: (variants: ABTestVariant[]) => void;
};

const VariantSettings: React.FC<VariantSettingsProps> = ({
  control, variants, onControlChange, onUpdateVariants,
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

  const onAddCondition = (id: string, key: string, value: string): void => {
    onUpdateVariants(variants.map((variant) => {
      const conditions = variant.conditions || [];
      if (
        variant.id === id
        && !conditions.some((v): boolean => v.key === key && v.value === value)
      ) {
        return {
          ...variant,
          conditions: [...conditions, { key, value }],
        };
      }

      return variant;
    }));
  };

  const onRemoveCondition = (id: string, key: string, value: string): void => {
    onUpdateVariants(variants.map((variant) => {
      if (variant.id === id) {
        const conditions = variant.conditions || [];

        return {
          ...variant,
          conditions: conditions.filter((c) => !(c.key === key && c.value === value)),
        };
      }

      return variant;
    }));
  };

  return (
    <PanelBody title={__('Variations', 'ab-testing-for-wp')} className="VariantSettings">
      <ControlSettings
        value={control}
        variants={variants}
        onChange={onControlChange}
      />
      {variants.map((variant) => (
        <>
          <DistributionSettings
            variant={variant}
            onUpdateDistribution={onUpdateDistribution}
          />
          <Conditionals
            variant={variant}
            onAddCondition={onAddCondition}
            onRemoveCondition={onRemoveCondition}
          />
        </>
      ))}
    </PanelBody>
  );
};

export default VariantSettings;
