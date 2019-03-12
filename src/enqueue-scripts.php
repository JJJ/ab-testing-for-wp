<?php

function registerGutenbergScript($name, $file) {
    wp_register_script(
        $name,
        plugins_url( '../dist/' . $file, __FILE__ ),
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n', 'wp-components']
    );
}

function ab_testing_for_wp_gutenberg_blocks() {
    registerGutenbergScript('ab-testing-for-wp_ab-test-block', 'ab-test.js');
    registerGutenbergScript('ab-testing-for-wp_ab-test-block-child', 'ab-test-child.js');

    register_block_type('ab-testing-for-wp/ab-test-block', [
        'editor_script' => 'ab-testing-for-wp_ab-test-block',
    ]);

    register_block_type('ab-testing-for-wp/ab-test-block-child', [
        'editor_script' => 'ab-testing-for-wp_ab-test-block-child',
    ]);
}

add_action('init', 'ab_testing_for_wp_gutenberg_blocks');
