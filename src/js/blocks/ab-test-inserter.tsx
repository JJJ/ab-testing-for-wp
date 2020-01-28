import React from 'react';

import { registerBlockType, createBlock, BlockInstance } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';

import SVGIcon from '../components/Logo/Logo';
import Inserter from '../components/Inserter/Inserter';
import EditWrapper from '../components/TestPreview/EditWrapper';

type EditProps = BlockInstance<{
  id: string;
}> & {
  setAttributes: (newAttributes: any) => void;
  removeSelf: () => void;
  insertNew: () => void;
};

const ABTestInserter = ({
  removeSelf,
  insertNew,
  attributes,
  setAttributes,
}: EditProps): React.ReactElement => {
  if (attributes.id) return <EditWrapper id={attributes.id} />;

  return (
    <Inserter
      pickTest={(id: string): void => setAttributes({ id: id.toString() })}
      removeSelf={removeSelf}
      insertNew={insertNew}
    />
  );
};

const edit: any = withDispatch((dispatch, props: any) => {
  const { removeBlock } = dispatch('core/block-editor');
  const { clientId, insertBlocksAfter } = props;

  const removeSelf = (): void => removeBlock(clientId);

  return {
    insertNew(): void {
      insertBlocksAfter(createBlock('ab-testing-for-wp/ab-test-block'));
      removeSelf();
    },
    removeSelf,
  };
})(ABTestInserter as any);

registerBlockType('ab-testing-for-wp/ab-test-block-inserter', {
  title: __('A/B Test', 'ab-testing-for-wp'),
  description: __(
    'A/B Test inserter allows you to pick an existing test or create a new one.',
    'ab-testing-for-wp',
  ),
  icon: SVGIcon,
  category: 'widgets',
  attributes: {
    id: {
      type: 'string',
      default: '',
    },
  },
  edit,
  save() {
    return null;
  },
});
