// @flow

import uniqueString from 'unique-string';

import {
  i18n,
  blocks,
  editor,
} from '../gutenberg';

import TestSelector from '../components/TestSelector/TestSelector';
import BoxShadow from '../components/BoxShadow/BoxShadow';
import DistributionSettings from '../components/DistributionSettings/DistributionSettings';
import PageSelector from '../components/PageSelector/PageSelector';

const { __ } = i18n;
const { registerBlockType } = blocks;
const { InnerBlocks, InspectorControls } = editor;

type ABTestBlockProps = {
  attributes: {
    tests: ABTest[];
    pageGoal: number;
  };
} & GutenbergProps;

const ALLOWED_BLOCKS = ['ab-testing-for-wp/ab-test-block-child'];

const defaultTests: ABTest[] = [
  {
    id: uniqueString(),
    name: 'A',
    selected: true,
    distribution: 50,
  },
  {
    id: uniqueString(),
    name: 'B',
    selected: false,
    distribution: 50,
  },
];

const makeTemplate = test => ['ab-testing-for-wp/ab-test-block-child', test];

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B test'),
  description: __('A/B test container which contains the possible tests.'),
  icon: 'admin-settings',
  category: 'widgets',
  attributes: {
    tests: {
      type: 'array',
      default: defaultTests,
    },
    pageGoal: {
      type: 'number',
      default: 0,
    },
  },
  edit(props: ABTestBlockProps) {
    const { attributes, setAttributes } = props;

    const { tests, pageGoal } = attributes;

    const onSelectTest = (id: string) => {
      setAttributes({
        tests: tests.map(test => ({ ...test, selected: test.id === id })),
      });
    };

    const onUpdateTests = (newTests: ABTest[]) => setAttributes({ tests: newTests });

    const onPageGoalChange = (page: number) => setAttributes({ pageGoal: page });

    const selectedTest = tests.find(test => !!test.selected);

    const css = `
      .ABTestChild { 
        display: none;
      }
      
      .ABTestChild--${selectedTest.id} { 
        display: block!important; 
      }
    `;

    return (
      <div>
        <style>{css}</style>
        <InspectorControls>
          <DistributionSettings
            tests={tests}
            onUpdateTests={onUpdateTests}
          />
          <PageSelector
            value={pageGoal}
            onChange={onPageGoalChange}
          />
        </InspectorControls>
        <InnerBlocks
          templateLock="all"
          template={tests.map(makeTemplate)}
          allowedBlocks={ALLOWED_BLOCKS}
        />
        <TestSelector
          tests={tests}
          onSelectTest={onSelectTest}
        />
        <BoxShadow />
      </div>
    );
  },
  save() {
    return <div><InnerBlocks.Content /></div>;
  },
});
