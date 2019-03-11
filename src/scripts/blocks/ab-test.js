// @flow

import { i18n, blocks, editor } from '../gutenberg';

const { __ } = i18n;
const { registerBlockType } = blocks;
const { InnerBlocks } = editor;

const ALLOWED_BLOCKS = ['ab-testing-for-wp/ab-test-block-child'];

const innerBlocksTemplate = [
  ['ab-testing-for-wp/ab-test-block-child', { testName: 'A' }],
  ['ab-testing-for-wp/ab-test-block-child', { testName: 'B' }],
];

type ABTestBlockProps = {
  attributes: {
    tests?: string[];
  };
};

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B test'),
  description: __('Creates an A/B test container.'),
  icon: 'admin-settings',
  category: 'widgets',
  edit(props: ABTestBlockProps) {
    const { attributes } = props;

    const { tests } = attributes;

    return (
      <>
        <InnerBlocks
          templateLock="all"
          template={innerBlocksTemplate(tests || ['A', 'B'])}
          allowedBlocks={ALLOWED_BLOCKS}
        />
      </>
    );
  },
  save() {
    return <InnerBlocks.Content />;
  },
});
