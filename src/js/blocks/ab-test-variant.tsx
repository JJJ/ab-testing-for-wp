import React from 'react';
import { BlockInstance, registerBlockType, TemplateArray } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

import SVGIcon from '../components/Logo/Logo';

import allowedBlockTypes from '../core/allowedBlockTypes';

type ABTestBlockChildProps = BlockInstance<ABTestVariant>;

function isValidContent(defaultContent: any): boolean {
  return defaultContent && defaultContent.block && defaultContent.block.name;
}

const edit: any = (props: ABTestBlockChildProps) => {
  const { attributes } = props;

  const { id, name, defaultContent } = attributes;

  const template: TemplateArray = defaultContent && isValidContent(defaultContent)
    ? [
      [defaultContent.block.name, defaultContent.attributes || {}],
    ]
    : [
      ['core/button', {
        text: sprintf(__('Button for Test Variant "%s"', 'ab-testing-for-wp'), name),
      }],
      ['core/paragraph', {
        placeholder: sprintf(__('Enter content or add blocks for test variant "%s"', 'ab-testing-for-wp'), name),
      }],
    ];

  return (
    <div className={`ABTestVariant ABTestVariant--${id}`}>
      <InnerBlocks
        template={template}
        templateLock={false}
        allowedBlocks={allowedBlockTypes()}
      />
    </div>
  );
};

const save: any = (props: ABTestBlockChildProps) => {
  const { attributes } = props;

  const { id } = attributes;

  return <div className={`ABTestChild--${id}`}><InnerBlocks.Content /></div>;
};

registerBlockType('ab-testing-for-wp/ab-test-block-variant', {
  title: __('A/B Test Variant', 'ab-testing-for-wp'),
  description: __('Test variant belonging to the parent A/B test container', 'ab-testing-for-wp'),
  icon: SVGIcon,
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
    distribution: {
      type: 'number',
      default: 50,
    },
    selected: {
      type: 'boolean',
      default: false,
    },
    defaultContent: {
      type: 'array',
      default: undefined,
    },
  },
  edit,
  save,
});
