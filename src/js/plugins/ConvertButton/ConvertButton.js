// @flow

import React from 'react';

import Logo from '../../components/Logo/Logo';

import {
  plugins,
  editPost,
  i18n,
  data,
  compose,
  blocks,
} from '../../wp';

import allowedBlockTypes from '../../core/allowedBlockTypes';

const { __ } = i18n;
const { registerPlugin } = plugins;
const { PluginBlockSettingsMenuItem } = editPost;
const { withSelect, withDispatch } = data;
const { cloneBlock, createBlock } = blocks;

type ConvertButtonProps = {
  selectedBlock: any;
  convertToTest: any;
  canConvert: boolean;
}

const ConvertButton = ({ convertToTest, selectedBlock, canConvert }: ConvertButtonProps) => {
  if (!canConvert) return null;

  return (
    <PluginBlockSettingsMenuItem
      allowedBlocks={allowedBlockTypes()}
      icon={<Logo />}
      label={__('Convert to A/B test')}
      onClick={() => {
        const testContainer = createBlock('ab-testing-for-wp/ab-test-block');
        const cloned = cloneBlock(selectedBlock);
        convertToTest(testContainer, cloned, selectedBlock);
      }}
    />
  );
};

function doesNotContainTarget(
  getBlocks: (id: string) => { name: string, clientId: string }[],
  id: string,
  target: string,
) {
  const children = getBlocks(id);

  return children.every((c) => {
    if (c.clientId === target) {
      return false;
    }

    return doesNotContainTarget(getBlocks, c.clientId, target);
  });
}

function getCanConvert(
  getBlocks: (id: string) => { name: string, clientId: string }[],
  id: string,
  disallowed: string[],
  target: string,
) {
  const children = getBlocks(id);

  return children.every((c) => {
    if (disallowed.indexOf(c.name) > -1) {
      return doesNotContainTarget(getBlocks, c.clientId, target);
    }

    return getCanConvert(getBlocks, c.clientId, disallowed, target);
  });
}

const enhancedConvertButton = compose.compose(
  withSelect((select) => {
    const editor = select('core/editor');

    const disallowed = [
      'ab-testing-for-wp/ab-test-block',
      'ab-testing-for-wp/ab-test-block-variant',
    ];

    const selectedBlock = editor.getSelectedBlock();
    const id = selectedBlock ? selectedBlock.clientId : '';
    const root = editor.getBlockHierarchyRootClientId(id);

    return {
      canConvert: getCanConvert(editor.getBlocks, root, disallowed, id),
      selectedBlock,
    };
  }),
  withDispatch((dispatch) => {
    const { insertBlock } = dispatch('core/editor');
    const { replaceBlock } = dispatch('core/block-editor');

    return {
      convertToTest(bfd, original, cloned) {
        const container = createBlock('ab-testing-for-wp/ab-test-block');
        console.log(original, cloned, container);

        insertBlock(container);
        replaceBlock(
          original.clientId,
          container,
        );
      },
    };
  }),
)(ConvertButton);

registerPlugin('block-settings-menu-ab-test-convert', { render: enhancedConvertButton });
