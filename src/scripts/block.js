import { i18n, blocks, editor } from './gutenberg';

const { __, sprintf } = i18n;
const { registerBlockType } = blocks;
const { InnerBlocks } = editor;

console.log(i18n);

const innerBlocksTemplate = name => ([
  'core/paragraph',
  { placeholder: sprintf(__('Enter content for test "%s"'), name) },
]);

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B test'),
  icon: 'admin-settings',
  category: 'widgets',
  edit() {
    return (
      <div>
        <InnerBlocks template={innerBlocksTemplate('A')} />
      </div>
    );
  },
  save() {
    return <div><InnerBlocks.Content /></div>;
  },
});
