import { i18n, blocks } from '../gutenberg';

const { registerBlockType } = blocks;
const { __ } = i18n;

registerBlockType('ab-testing-for-wp/ab-test-block-child', {
  title: __('A/B test child'),
  icon: 'admin-settings',
  category: 'widgets',
  parent: ['ab-testing-for-wp/ab-test-block'],
  inserter: false,
  edit() {
    return (
      <div>Test</div>
    );
  },
  save() {
    return <div>Test</div>;
  },
});
