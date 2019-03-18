// @flow @jsx wp.element.createElement

import { i18n, blocks, editor } from '../WP';

const { registerBlockType } = blocks;
const { __, sprintf } = i18n;
const { InnerBlocks } = editor;

type ABTestBlockChildProps = {
  attributes: ABTestVariant;
} & GutenbergProps;

const disallowedBlocks = [
  'ab-testing-for-wp/ab-test-block',
  'ab-testing-for-wp/ab-test-block-variant',
];

registerBlockType('ab-testing-for-wp/ab-test-block-variant', {
  title: __('A/B Test Variant'),
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
        content: sprintf(__('A/B Test Variant "%s"'), name),
        level: 4,
      }],
      ['core/button', {
        text: sprintf(__('Button for Test Variant "%s"'), name),
      }],
      ['core/paragraph', { placeholder: sprintf(__('Enter content or add blocks for test variant "%s"'), name) }],
    ];

    const allowedBlocks = wp.blocks.getBlockTypes()
      .map(type => type.name)
      .filter(typeName => disallowedBlocks.indexOf(typeName) === -1);

    return (
      <div className={`ABTestVariant ABTestVariant--${id}`}>
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
