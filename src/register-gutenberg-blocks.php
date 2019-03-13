<?php

namespace ABTestingForWP;

class RegisterGutenbergBlocks {

    public function __construct() {
        $renderer = new BlockRenderer();

        // register scripts
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block', 'ab-test.js');
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block-variant', 'ab-test-variant.js');

        // register AB test container
        register_block_type('ab-testing-for-wp/ab-test-block', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block',
            'render_callback' => [$renderer, 'renderTest'],
        ]);

        // register AB test variant
        register_block_type('ab-testing-for-wp/ab-test-block-variant', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block-variant',
        ]);
    }

    public function registerGutenbergScript($name, $file) {
        wp_register_script(
            $name,
            plugins_url( '../dist/' . $file, __FILE__ ),
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n', 'wp-components', 'wp-api-fetch']
        );
    }

}
