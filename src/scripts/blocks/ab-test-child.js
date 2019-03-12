// @flow

import { i18n, blocks, editor } from '../gutenberg';

const { registerBlockType } = blocks;
const { __, sprintf } = i18n;
const { InnerBlocks } = editor;

type ABTestBlockChildProps = {
  attributes: ABTest;
} & GutenbergProps;

const disallowedBlocks = [
  'ab-testing-for-wp/ab-test-block',
  'ab-testing-for-wp/ab-test-block-child',
];

registerBlockType('ab-testing-for-wp/ab-test-block-child', {
  title: __('A/B test variant'),
  icon: 'admin-settings',
  category: 'widgets',
  parent: ['ab-testing-for-wp/ab-test-block'],
  supports: {
    inserter: false,
    reusable: false,
    html: false,
  },
  attributes: {
    id: {
      type: 'string',
      default: '',
    },
    name: {
      type: 'string',
      default: '',
    },
    selected: {
      type: 'boolean',
      default: false,
    },
  },
  edit(props: ABTestBlockChildProps) {
    const { attributes } = props;

    const { id, name } = attributes;

    const template = [
      ['core/heading', {
        content: sprintf(__('A/B Test variant "%s"'), name),
        level: 4,
      }],
      ['core/button', {
        text: sprintf(__('Button for test "%s"'), name),
      }],
      ['core/paragraph', { placeholder: sprintf(__('Enter content for test variant "%s"'), name) }],
    ];

    const allowedBlocks = wp.blocks.getBlockTypes()
      .map(type => type.name)
      .filter(typeName => disallowedBlocks.indexOf(typeName) === -1);

    return (
      <div className={`ABTestChild ABTestChild--${id}`}>
        <InnerBlocks
          template={template}
          templateLock={false}
          allowedBlocks={allowedBlocks}
        />
      </div>
    );
  },
  save(props: ABTestBlockChildProps) {
    const { attributes } = props;

    const { id } = attributes;

    return <div className={`ABTestChild--${id}`}><InnerBlocks.Content /></div>;
  },
});
