<?php

namespace ABTestingForWP;

require __DIR__ . '/block-renderer.php';

class RegisterGutenbergBlocks {    
    
    public function __construct() {
        $renderer = new BlockRenderer();

        // register scripts
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block', 'ab-test.js');
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block-child', 'ab-test-child.js');

        // register AB test container
        register_block_type('ab-testing-for-wp/ab-test-block', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block',
            'render_callback' => [$renderer, 'renderTest'],
        ]);

        // register AB test child
        register_block_type('ab-testing-for-wp/ab-test-block-child', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block-child',
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
