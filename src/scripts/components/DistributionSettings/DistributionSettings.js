// @flow

import { i18n, components } from '../../gutenberg';

const { __, sprintf } = i18n;
const { PanelBody, RangeControl } = components;

type DistributionSettingsProps = {
  tests: ABTest[];
  onUpdateTests: (tests: ABTest[]) => void;
};

function DistributionSettings({ tests, onUpdateTests }: DistributionSettingsProps) {
  const onUpdateDistribution = (id: string, newDistribution: number) => {
    const otherTests = tests.filter(test => test.id !== id);
    const combinedLeft = otherTests.reduce((a, b) => a + (b.distribution || 0), 0);
    const rate = combinedLeft !== 0 ? (100 - newDistribution) / combinedLeft : 0;

    onUpdateTests(tests.map((test) => {
      if (test.id === id) {
        return {
          ...test,
          distribution: newDistribution,
        };
      }

      return {
        ...test,
        distribution: Math.round(combinedLeft === 0
          ? (100 - newDistribution) / otherTests.length
          : test.distribution * rate),
      };
    }));
  };

  return (
    <PanelBody title={__('Variation distribution')}>
      {tests.map(test => (
        <RangeControl
          label={sprintf(__('Variation %s'), test.name)}
          value={test.distribution}
          onChange={nextDistribution => onUpdateDistribution(test.id, nextDistribution)}
          min={0}
          max={100}
        />
      ))}
    </PanelBody>
  );
}

export default DistributionSettings;
