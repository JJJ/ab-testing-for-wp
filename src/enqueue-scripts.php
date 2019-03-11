<?php

function ab_testing_for_wp_gutenberg_blocks() {
  wp_register_script(
      'ab-testing-for-wp-gutenberg-block',
      plugins_url( '../dist/block.js', __FILE__ ),
      ['wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n']
  );

  register_block_type('ab-testing-for-wp/ab-test-block', [
      'editor_script' => 'ab-testing-for-wp-gutenberg-block',
   ]);
}

add_action('init', 'ab_testing_for_wp_gutenberg_blocks');