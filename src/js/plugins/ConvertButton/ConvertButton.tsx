import React from 'react';
import { createBlock } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

import Logo from '../../components/Logo/Logo';

import allowedBlockTypes from '../../core/allowedBlockTypes';

type ConvertButtonProps = {
  blockAttributes: any;
  selectedBlock: any;
  convertToTest: any;
  canConvert: boolean;
}

const ConvertButton = ({
  blockAttributes,
  convertToTest,
  selectedBlock,
  canConvert,
}: ConvertButtonProps): JSX.Element | null => {
  if (!canConvert) return null;

  return (
    <PluginBlockSettingsMenuItem
      allowedBlocks={allowedBlockTypes()}
      icon={<Logo />}
      label={__('Convert to A/B test', 'ab-testing-for-wp')}
      onClick={(): void => {
        // eslint-disable-next-line no-alert
        const isConfirmed = window.confirm(
          __('Are you sure you want to convert this block to an A/B test?', 'ab-testing-for-wp'),
        );

        if (!isConfirmed) return;
        convertToTest(selectedBlock, blockAttributes);
      }}
    />
  );
};

function doesNotContainTarget(
  getBlocks: (id: string) => { name: string; clientId: string }[],
  id: string,
  target: string,
): boolean {
  const children = getBlocks(id);

  return children.every((c) => {
    if (c.clientId === target) {
      return false;
    }

    return doesNotContainTarget(getBlocks, c.clientId, target);
  });
}

function getCanConvert(
  getBlocks: (id: string) => { name: string; clientId: string }[],
  id: string,
  disallowed: string[],
  target: string,
): boolean {
  const children = getBlocks(id);

  return children.every((c) => {
    if (disallowed.indexOf(c.name) > -1) {
      return doesNotContainTarget(getBlocks, c.clientId, target);
    }

    return getCanConvert(getBlocks, c.clientId, disallowed, target);
  });
}

const enhancedConvertButton = compose(
  withSelect((select) => {
    const editor = select('core/block-editor');

    const disallowed = [
      'ab-testing-for-wp/ab-test-block',
      'ab-testing-for-wp/ab-test-block-variant',
    ];

    const selectedBlock = editor.getSelectedBlock();
    const id = selectedBlock ? selectedBlock.clientId : '';
    const root = editor.getBlockHierarchyRootClientId(id);
    const blockAttributes = editor.getBlockAttributes(id);

    return {
      blockAttributes,
      canConvert: getCanConvert(editor.getBlocks, root, disallowed, id),
      selectedBlock,
    };
  }),
  withDispatch((dispatch) => {
    const { replaceBlock } = dispatch('core/block-editor');

    return {
      convertToTest(original: any, blockAttributes: any): void {
        const container = createBlock(
          'ab-testing-for-wp/ab-test-block',
          {
            defaultContent: {
              block: original,
              attributes: blockAttributes,
            },
          },
        );

        replaceBlock(
          original.clientId,
          container,
        );
      },
    };
  }),
)(ConvertButton);

const Icon: React.FC = () => <div />;

registerPlugin('block-settings-menu-ab-test-convert', { icon: Icon, render: enhancedConvertButton });
